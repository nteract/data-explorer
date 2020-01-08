import { scaleLinear, ScaleLinear, scaleThreshold } from "d3-scale";
import * as React from "react";
import { heatmapping, hexbinning } from "semiotic";

import HTMLLegend from "../HTMLLegend";
import TooltipContent from "../tooltip-content";
import { numeralFormatting } from "../utilities";

import * as Dx from "../types";
import { sortByOrdinalRange } from "./shared";

import styled from "styled-components";

const TooltipHeader = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  margin: 5px;
  font-weight: 900;
`;

const TooltipP = styled.div`
  fontsize: 12px;
  texttransform: uppercase;
  margin: 5px;
`;

interface XYPlotOptions {
  areaType: Dx.AreaType;
  chart: Dx.ChartOptions["chart"];
  colors: Dx.ChartOptions["colors"];
  dimensions: Dx.ChartOptions["dimensions"];
  height: Dx.ChartOptions["height"];
  primaryKey: Dx.ChartOptions["primaryKey"];
  setColor: Dx.ChartOptions["setColor"];
  trendLine: Dx.TrendLineType;
  marginalGraphics: Dx.SummaryType;
}

const binHash = {
  heatmap: heatmapping,
  hexbin: hexbinning
};

const steps = ["none", "#FBEEEC", "#f3c8c2", "#e39787", "#ce6751", "#b3331d"];
const thresholds = scaleThreshold<number, string>()
  .domain([0.01, 0.2, 0.4, 0.6, 0.8])
  .range(steps);

function combineTopAnnotations(
  topQ: Dx.Datapoint[],
  topSecondQ: Dx.Datapoint[],
  dim2: string
): any[] {
  const combinedAnnotations: Dx.JSONObject[] = [];
  const combinedHash: {
    [index: string]: { [index: string]: any; coordinates: Dx.Datapoint[] };
  } = {};
  [...topQ, ...topSecondQ].forEach(topDatapoint => {
    const hashD = combinedHash[topDatapoint[dim2]];

    if (hashD) {
      const newCoordinates = (hashD.coordinates && [
        ...hashD.coordinates,
        topDatapoint
      ]) || [topDatapoint, hashD];
      Object.keys(combinedHash[topDatapoint[dim2]]).forEach(key => {
        delete combinedHash[topDatapoint[dim2]][key];
      });
      combinedHash[topDatapoint[dim2]].id = topDatapoint[dim2];
      combinedHash[topDatapoint[dim2]].label = topDatapoint[dim2];
      combinedHash[topDatapoint[dim2]].type = "react-annotation";
      combinedHash[topDatapoint[dim2]].coordinates = newCoordinates;
    } else {
      combinedHash[topDatapoint[dim2]] = {
        type: "react-annotation",
        label: topDatapoint[dim2],
        id: topDatapoint[dim2],
        coordinates: [],
        ...topDatapoint
      };
      combinedAnnotations.push(combinedHash[topDatapoint[dim2]]);
    }
  });
  return combinedAnnotations;
}

export const semioticHexbin = (
  data: Dx.DataProps["data"],
  schema: Dx.DataProps["schema"],
  options: XYPlotOptions
) => {
  return semioticScatterplot(data, schema, options, options.areaType);
};

export const semioticScatterplot = (
  data: Dx.DataProps["data"],
  schema: Dx.DataProps["schema"],
  options: XYPlotOptions,
  type: string = "scatterplot"
) => {
  const height = options.height - 150 || 500;

  const {
    chart,
    primaryKey,
    colors,
    setColor,
    dimensions,
    trendLine,
    marginalGraphics
  } = options;

  const { dim1, dim2, dim3, metric1, metric2, metric3 } = chart;
  const filteredData: Dx.Datapoint[] = data.filter(
    (datapoint: Dx.Datapoint) =>
      datapoint[metric1] &&
      datapoint[metric2] &&
      (!metric3 || metric3 === "none" || datapoint[metric3])
  );

  const pointTooltip = (hoveredDatapoint: Dx.Datapoint) => {
    return (
      <TooltipContent x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
        <h3>{primaryKey.map(pkey => hoveredDatapoint[pkey]).join(", ")}</h3>
        {dimensions.map(dim => (
          <p key={`tooltip-dim-${dim.name}`}>
            {dim.name}:{" "}
            {(hoveredDatapoint[dim.name].toString &&
              hoveredDatapoint[dim.name].toString()) ||
              hoveredDatapoint[dim.name]}
          </p>
        ))}
        <p>
          {metric1}: {hoveredDatapoint[metric1]}
        </p>
        <p>
          {metric2}: {hoveredDatapoint[metric2]}
        </p>
        {metric3 && metric3 !== "none" && (
          <p>
            {metric3}: {hoveredDatapoint[metric3]}
          </p>
        )}
      </TooltipContent>
    );
  };

  const areaTooltip = (hoveredDatapoint: Dx.Datapoint) => {
    const binItems = hoveredDatapoint.binItems || hoveredDatapoint.data || [];

    if (binItems.length === 0) {
      return null;
    }
    return (
      <TooltipContent x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
        <TooltipHeader>
          ID, {metric1}, {metric2}
        </TooltipHeader>
        {binItems.map(
          (binnedDatapoint: { [index: string]: any }, index: number) => {
            const id = dimensions
              .map(
                dim =>
                  (binnedDatapoint[dim.name].toString &&
                    binnedDatapoint[dim.name].toString()) ||
                  binnedDatapoint[dim.name]
              )
              .join(",");
            return (
              <TooltipP key={id + index}>
                {id}, {binnedDatapoint[metric1]}, {binnedDatapoint[metric2]}
              </TooltipP>
            );
          }
        )}
      </TooltipContent>
    );
  };

  let sizeScale: (() => number) | ScaleLinear<number, number> = () => 5;
  const colorHash: { [index: string]: string } = { Other: "grey" };
  const additionalSettings: { afterElements?: JSX.Element } = {};

  let annotations;

  if (dim2 && dim2 !== "none") {
    const topQ = [...filteredData]
      .sort(
        (datapointA, datapointB) => datapointB[metric1] - datapointA[metric1]
      )
      .filter((d, index) => index < 3);
    const topSecondQ = [...filteredData]
      .sort(
        (datapointA, datapointB) => datapointB[metric2] - datapointA[metric2]
      )
      .filter(datapoint => topQ.indexOf(datapoint) === -1)
      .filter((d, index) => index < 3);

    annotations = combineTopAnnotations(topQ, topSecondQ, dim2);
  }

  // disabling annotations for now
  annotations = undefined;

  if (metric3 && metric3 !== "none") {
    const dataMin = Math.min(
      ...filteredData.map(datapoint => datapoint[metric3])
    );
    const dataMax = Math.max(
      ...filteredData.map(datapoint => datapoint[metric3])
    );
    sizeScale = scaleLinear()
      .domain([dataMin, dataMax])
      .range([2, 20]);
  }
  const sortedData = sortByOrdinalRange(
    metric1,
    (metric3 !== "none" && metric3) || metric2,
    "none",
    data
  );

  if (
    (type === "scatterplot" || type === "contour") &&
    dim1 &&
    dim1 !== "none"
  ) {
    const uniqueValues = sortedData.reduce(
      (uniqueArray, datapoint) =>
        (!uniqueArray.find(
          (uniqueDim: string) => uniqueDim === datapoint[dim1].toString()
        ) && [...uniqueArray, datapoint[dim1].toString()]) ||
        uniqueArray,
      []
    );

    uniqueValues.forEach((dimValue: string, index: number) => {
      colorHash[dimValue] = index > 18 ? "grey" : colors[index % colors.length];
    });

    additionalSettings.afterElements = (
      <HTMLLegend
        valueHash={{}}
        values={uniqueValues}
        colorHash={colorHash}
        setColor={setColor}
        colors={colors}
      />
    );
  }

  let areas: Array<{ coordinates: Dx.Datapoint[] }> = [];
  if (
    type === "heatmap" ||
    type === "hexbin" ||
    (type === "contour" && dim3 === "none")
  ) {
    areas = [{ coordinates: filteredData }];

    if (type !== "contour") {
      const calculatedAreas = binHash[type]({
        summaryType: { type, bins: 10 },
        data: {
          coordinates: filteredData.map(datapoint => ({
            ...datapoint,
            x: datapoint[metric1],
            y: datapoint[metric2]
          }))
        },
        size: [height, height]
      });

      areas = calculatedAreas;

      const thresholdSteps = [0.2, 0.4, 0.6, 0.8, 1]
        .map(thresholdValue =>
          Math.floor(calculatedAreas.binMax * thresholdValue)
        )
        .reduce(
          (thresholdArray: number[], thresholdValue: number) =>
            thresholdValue === 0 ||
            thresholdArray.indexOf(thresholdValue) !== -1
              ? thresholdArray
              : [...thresholdArray, thresholdValue],
          []
        );

      const withZeroThresholdSteps = [0, ...thresholdSteps];

      const hexValues: string[] = [];

      withZeroThresholdSteps.forEach((thresholdValue, index) => {
        const nextValue = withZeroThresholdSteps[index + 1];
        if (nextValue) {
          hexValues.push(`${thresholdValue + 1} - ${nextValue}`);
        }
      });

      const thresholdColors = [
        "#FBEEEC",
        "#f3c8c2",
        "#e39787",
        "#ce6751",
        "#b3331d"
      ];
      const hexHash: { [index: string]: string } = {};

      hexValues.forEach((binLabel, index) => {
        hexHash[binLabel] = thresholdColors[index];
      });

      thresholds
        .domain([0.01, ...thresholdSteps])
        .range([
          "none",
          ...thresholdColors.filter((d, index) => index < thresholdSteps.length)
        ]);

      additionalSettings.afterElements = (
        <HTMLLegend
          valueHash={{}}
          values={hexValues}
          colorHash={hexHash}
          colors={colors}
          setColor={setColor}
        />
      );
    }
  } else if (type === "contour") {
    const multiclassHash: {
      [index: string]: {
        label: string;
        color: string;
        coordinates: Dx.Datapoint[];
      };
    } = {};
    areas = [];
    filteredData.forEach(datapoint => {
      if (!multiclassHash[datapoint[dim1]]) {
        multiclassHash[datapoint[dim1]] = {
          label: datapoint[dim1],
          color: colorHash[datapoint[dim1]],
          coordinates: []
        };
        areas.push(multiclassHash[datapoint[dim1]]);
      }
      multiclassHash[datapoint[dim1]].coordinates.push(datapoint);
    });
  }

  const renderInCanvas =
    (type === "scatterplot" || type === "contour") && data.length > 999;

  let marginalGraphicsAxes: object[] = [];

  if (marginalGraphics !== "none" && type === "scatterplot") {
    marginalGraphicsAxes = [
      {
        orient: "right",
        tickLineGenerator: () => <g />,
        tickFormat: () => "",
        marginalSummaryType: {
          type: marginalGraphics,
          showPoints: !renderInCanvas
        }
      },
      {
        orient: "top",
        tickLineGenerator: () => <g />,
        tickFormat: () => "",
        marginalSummaryType: {
          type: marginalGraphics,
          showPoints: !renderInCanvas
        }
      }
    ];
  }

  let calculatedSummaryType;
  if (type === "scatterplot" && trendLine !== "none") {
    calculatedSummaryType = { type: "trendline", regressionType: trendLine };
  } else if (type !== "scatterplot") {
    calculatedSummaryType = {
      type,
      bins: 10,
      thresholds: dim3 === "none" ? 6 : 3
    };
  }

  const xyPlotSettings: { [key: string]: any } = {
    xAccessor: type === "hexbin" || type === "heatmap" ? "x" : metric1,
    yAccessor: type === "hexbin" || type === "heatmap" ? "y" : metric2,
    axes: [
      {
        orient: "left",
        ticks: 6,
        label: metric2,
        tickFormat: numeralFormatting,
        baseline: type === "scatterplot",
        tickSize: type === "heatmap" ? 0 : undefined
      },
      {
        orient: "bottom",
        ticks: 6,
        label: metric1,
        tickFormat: numeralFormatting,
        footer: type === "heatmap",
        baseline: type === "scatterplot",
        tickSize: type === "heatmap" ? 0 : undefined
      },
      ...marginalGraphicsAxes
    ],
    points: (type === "scatterplot" || type === "contour") && data,
    canvasPoints: renderInCanvas,
    summaryType: calculatedSummaryType,
    summaryStyle: (areaDatapoint: Dx.Datapoint) => {
      if (type === "scatterplot") {
        return { stroke: "darkred", strokeWidth: 2, fill: "none" };
      }

      return {
        fill:
          type === "contour"
            ? "none"
            : thresholds((areaDatapoint.binItems || areaDatapoint.data).length),
        stroke:
          type !== "contour"
            ? undefined
            : dim3 === "none"
            ? "#BBB"
            : areaDatapoint.parentSummary.color,
        strokeWidth: type === "contour" ? 2 : 1
      };
    },
    pointStyle: (datapoint: Dx.Datapoint) => ({
      r: renderInCanvas
        ? 2
        : type === "contour"
        ? 3
        : sizeScale(datapoint[metric3]),
      fill: colorHash[datapoint[dim1]] || "black",
      fillOpacity: 0.75,
      stroke: renderInCanvas ? "none" : type === "contour" ? "white" : "black",
      strokeWidth: type === "contour" ? 0.5 : 1,
      strokeOpacity: 0.9
    }),
    hoverAnnotation: true,
    responsiveWidth: false,
    size: [height + 105, height + 80],
    margin: { left: 75, bottom: 50, right: 30, top: 30 },
    annotations: (type === "scatterplot" && annotations) || undefined,
    annotationSettings: {
      layout: { type: "marginalia", orient: "right", marginOffset: 30 }
    },
    tooltipContent:
      ((type === "hexbin" || type === "heatmap") && areaTooltip) ||
      pointTooltip,
    ...additionalSettings
  };

  if (type !== "scatterplot") {
    xyPlotSettings.areas = areas;
  }

  return xyPlotSettings;
};
