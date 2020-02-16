import { nest } from "d3-collection";
import { interpolateLab } from "d3-interpolate";
import * as React from "react";

import TooltipContent from "../utilities/tooltip-content";

import { chartHelpText } from "../docs/chart-docs";
import * as Dx from "../utilities/types";

interface HierarchicalOptions {
  hierarchyType: Dx.HierarchyType;
  chart: Dx.Chart;
  selectedDimensions: Dx.ChartOptions["selectedDimensions"];
  primaryKey: Dx.ChartOptions["primaryKey"];
  colors: Dx.ChartOptions["colors"];
}

const overrideFrameHover = hierarchyType => annotation => {
  const { d } = annotation
  if (d.type === "frame-hover" && hierarchyType !== "treemap") {
    return
  }
  return null
}

const hierarchicalAnnotation = (hierarchyType, selectedDimensions, metric) => annotation => {
  const { d, networkFrameState, nodes: drawnNodes } = annotation
  const { type, parent } = d
  const { networkFrameRender } = networkFrameState

  if (hierarchyType !== "treemap" && parent && type === "highlight") {
    const { nodes } = networkFrameRender
    const { customMark, styleFn: baseStyle } = nodes

    const ancestors = parent.ancestors()
    const parentPlusPieces = [parent, ...ancestors]

    const drawnPieces = parentPlusPieces
      .map(d => drawnNodes.find(p => p.depth === 0 && d.depth === 0 || (p.hierarchicalID === d.hierarchicalID)))

    const allPieces = [d, ...drawnPieces]
    const baseMarkProps = { forceUpdate: true }

    const ancestorHighlight = allPieces
      .map((node, nodei) => {
        const transform = `translate(${node.x},${node.y})`
        const styleFn = d => ({ ...baseStyle(d), ...{ fill: "red", opacity: 0.5, stroke: "red", strokeWidth: "4px" } })
        const customNode = customMark({ d: node, styleFn, transform: transform, baseMarkProps, key: `highlight-${nodei}-parent` })

        const thisLevelName = selectedDimensions[node.depth - 1]


        return <g>{customNode}
          <text transform={transform}>{thisLevelName && `${thisLevelName}: ${node.key}`}{node.depth !== 0 && node[metric] && `${metric}: ${node[metric]}`}</text>
        </g>
      })
    return <g>{ancestorHighlight}</g>
  }
  return null
}

const parentPath = (datapoint: Dx.Datapoint, pathArray: string[]) => {
  if (datapoint.parent) {
    pathArray = parentPath(datapoint.parent, [datapoint.key, ...pathArray]);
  } else {
    pathArray = [...pathArray];
  }
  return pathArray;
};

const hierarchicalTooltip = (
  datapoint: Dx.Datapoint,
  primaryKey: string[],
  metric: string,
  selectedDimensions: string[]
) => {
  const pathString = datapoint.parent
    ? parentPath(
      datapoint.parent,
      (datapoint.key && [datapoint.key]) || []
    ).map((d, i) => <p>{selectedDimensions[i]}: {d}</p>)
    : "";
  const content = [];
  if (!datapoint.parent) {
    content.push(<h2 key="hierarchy-title">Root</h2>);
  } else if (datapoint.key) {
    content.push(<h2 key="hierarchy-title">{datapoint.key}</h2>);
    content.push(<p key="path-string">{pathString}</p>);
    content.push(<p key="hierarchy-value">Total Value: {datapoint.value}</p>);
    content.push(
      <p key="hierarchy-children">Children: {datapoint.children.length}</p>
    );
  } else {
    content.push(pathString,
      <p key="leaf-label">
        {primaryKey.map((pkey: string) => datapoint[pkey]).join(", ")}
      </p>
    );
    content.push(
      <p key="hierarchy-value">
        {metric}: {datapoint[metric]}
      </p>
    );
  }

  return content;
};

const hierarchicalColor = (
  colorHash: { [index: string]: string },
  datapoint: Dx.Datapoint
) => {
  if (datapoint.depth === 0) {
    return "white";
  }
  if (datapoint.depth === 1) {
    return colorHash[datapoint.key];
  }
  let colorNode = datapoint;
  for (let x = datapoint.depth; x > 1; x--) {
    colorNode = colorNode.parent;
  }
  const lightenScale = interpolateLab("white", colorHash[colorNode.key]);

  return lightenScale(Math.max(0, datapoint.depth / 6));
};

export const semioticHierarchicalChart = (
  data: Dx.DataProps["data"],
  schema: Dx.DataProps["schema"],
  options: HierarchicalOptions,
  colorHashOverride?: { key?: string },
  colorDimOverride?: string
) => {
  const {
    hierarchyType: baseHierarchyType = "dendrogram",
    chart,
    selectedDimensions,
    primaryKey,
    colors
  } = options;
  const { metric1 } = chart;

  // a sunburst is just a radial partition
  const hierarchyType =
    baseHierarchyType === "sunburst" ? "partition" : baseHierarchyType;

  if (selectedDimensions.length === 0) {
    return {};
  }

  const nestingParams = nest<{ [index: string]: string }>();

  selectedDimensions.forEach((dim: string) => {
    nestingParams.key((param: { [index: string]: string }) => param[dim]);
  });

  const colorHash: {} = colorHashOverride || {};
  const sanitizedData: Array<{}> = [];

  data.forEach((datapoint: Dx.Datapoint) => {
    if (!colorDimOverride && !colorHash[datapoint[selectedDimensions[0]]]) {
      colorHash[datapoint[selectedDimensions[0]]] =
        colors[Object.keys(colorHash).length];
    }

    sanitizedData.push({
      ...datapoint,
      sanitizedR: datapoint.r,
      r: undefined
    });
  });

  const entries = nestingParams.entries(sanitizedData.sort((a, b) => a[metric1] - b[metric1]));
  const rootNode = { id: "all", values: entries };

  const hierarchySettings = {
    edges: rootNode,
    edgeStyle: () => ({ fill: "lightgray", stroke: "gray" }),
    nodeStyle: (node: { depth: number }) => {
      return {
        fill: hierarchicalColor(colorHash, node),
        stroke: node.depth === 1 ? "white" : "black",
        strokeOpacity: node.depth * 0.1 + 0.2
      };
    },
    networkType: {
      type: hierarchyType,
      projection: baseHierarchyType === "sunburst" && "radial",
      hierarchySum: (node: { [index: string]: number }) => node[metric1],
      hierarchyChildren: (node: { values: Array<{}> }) => node.values,
      padding: hierarchyType === "treemap" ? 3 : 0,
      zoom: false
    },
    edgeRenderKey: (edge: object, index: number) => {
      return index;
    },
    nodeIDAccessor: (d, i) => d.id || d.key || i,
    baseMarkProps: { forceUpdate: true },
    margin: { left: 10, right: 10, top: 10, bottom: 10 },
    hoverAnnotation: [
      { type: "frame-hover" },
      {
        type: "highlight",
        style: {
          stroke: "red",
          strokeOpacity: 0.5,
          strokeWidth: 5,
          fill: "none"
        }
      }
    ],
    svgAnnotationRules: hierarchicalAnnotation(hierarchyType, selectedDimensions, metric1),
    htmlAnnotationRules: overrideFrameHover(hierarchyType),
    tooltipContent: (hoveredDatapoint: Dx.Datapoint) => {
      return (
        <TooltipContent x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
          {hierarchicalTooltip(hoveredDatapoint, primaryKey, metric1, selectedDimensions)}
        </TooltipContent>
      );
    }
  };

  return { frameSettings: hierarchySettings, colorDim: selectedDimensions[0], colorHash }

};
