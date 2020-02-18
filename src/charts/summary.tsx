import { scaleLinear } from "d3-scale";
import * as React from "react";

import HTMLLegend from "../components/HTMLLegend";
import TooltipContent from "../utilities/tooltip-content";
import * as Dx from "../utilities/types";
import { numeralFormatting } from "../utilities/utilities";

interface SummaryOptions {
  chart: Dx.Chart;
  colors: Dx.ChartOptions["colors"];
  primaryKey: string[];
  setColor: Dx.ChartOptions["setColor"];
  summaryType: Dx.SummaryType;
  showLegend: boolean;
  dimensions: Dx.Dimension[];
}

const fontScale = scaleLinear()
  .domain([8, 25])
  .range([14, 8])
  .clamp(true);

export const semioticSummaryChart = (
  data: Dx.DataProps["data"],
  schema: Dx.DataProps["schema"],
  options: SummaryOptions,
  colorHashOverride?: { key?: string },
  colorDimOverride?: string
) => {
  const additionalSettings: { afterElements?: JSX.Element } = {};
  const colorHash: {} = colorHashOverride || {};

  const { chart, summaryType, primaryKey, colors, setColor, showLegend } = options;

  const { dim1, metric1 } = chart;

  const oAccessor = dim1;

  const rAccessor = metric1;

  const uniqueValues = data.reduce(
    (uniqueArray: string[], datapoint) =>
      (!uniqueArray.find(
        (dimValue: string) => dimValue === datapoint[dim1].toString()
      ) && [...uniqueArray, datapoint[dim1].toString()]) ||
      uniqueArray,
    []
  );

  if (!colorHashOverride && dim1 && dim1 !== "none") {
    uniqueValues.sort().forEach((dimValue, index) => {
      colorHash[dimValue] = colors[index % colors.length];
    });
    if (showLegend) {
      additionalSettings.afterElements = (
        <HTMLLegend
          valueHash={{}}
          colorHash={colorHash}
          setColor={setColor}
          colors={colors}
        />
      );
    }
  }

  const summarySettings = {
    summaryType: { type: summaryType, bins: 16, amplitude: 20 },
    type: summaryType === "violin" && data.length < 250 && "swarm",
    projection: "horizontal",
    data,
    oAccessor,
    rAccessor,
    summaryStyle: (summaryDatapoint: Dx.Datapoint) => ({
      fill: colorHash[summaryDatapoint[colorDimOverride || dim1]] || colors[0],
      fillOpacity: 0.8,
      stroke: colorHash[summaryDatapoint[colorDimOverride || dim1]] || colors[0]
    }),
    style: (pieceDatapoint: Dx.Datapoint) => ({
      fill: colorHash[pieceDatapoint[colorDimOverride || dim1]] || colors[0],
      stroke: "white"
    }),
    oPadding: 5,
    oLabel:
      uniqueValues.length > 30
        ? false
        : (columnName: string) => (
          <text
            textAnchor="end"
            fontSize={`${(columnName && fontScale(columnName.length)) ||
              12}px`}
          >
            {columnName}
          </text>
        ),
    margin: { top: 25, right: 10, bottom: 50, left: 100 },
    axes: [{
      orient: "bottom",
      label: rAccessor,
      tickFormat: numeralFormatting
    }],
    baseMarkProps: { forceUpdate: true },
    pieceHoverAnnotation: summaryType === "violin",
    tooltipContent: (hoveredDatapoint: Dx.Datapoint) => {
      const dimensions = options.dimensions.filter(dim => dim.name !== dim1)
      const furtherDims = dimensions.map(dim => <p>{dim.name}: {hoveredDatapoint[dim.name]}</p>)
      return (
        <TooltipContent x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
          <h3>{primaryKey.map(pkey => hoveredDatapoint[pkey]).join(", ")}</h3>
          <p>
            {dim1}: {hoveredDatapoint[dim1]}
          </p>
          {furtherDims}
          <p>
            {rAccessor}: {hoveredDatapoint[rAccessor]}
          </p>
        </TooltipContent>
      );
    },
    ...additionalSettings
  };

  return { frameSettings: summarySettings, colorDim: dim1, colorHash }

};
