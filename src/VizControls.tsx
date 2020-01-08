import * as React from "react";

import { ChartOptionTypes, controlHelpText } from "./docs/chart-docs";

import styled, { css } from "styled-components";
import * as Dx from "./types";

const commonCSS = css`
  h2 {
    text-transform: capitalize;
    margin-bottom: 10px;
  }
  select {
    height: 30px;
  }

  .selected {
    background-color: #d8e1e8 !important;
    background-image: none !important;
  }
`;

const ControlWrapper = styled.div`
  margin-right: 30px;
  ${commonCSS}
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-bottom: 30px;
  ${commonCSS}
`;

const metricDimSelector = (
  values: string[],
  selectionFunction: (val: string) => void,
  title: string,
  required: boolean,
  selectedValue: string,
  contextTooltip = "Help me help you help yourself"
) => {
  const metricsList = required ? values : ["none", ...values];
  let displayMetrics;

  if (metricsList.length > 1) {
    displayMetrics = (
      <select
        onChange={(event: { target: { value: string } }): void => {
          selectionFunction(event.target.value);
        }}
        value={selectedValue}
      >
        {metricsList.map((metricName: string, i) => (
          <option
            aria-selected={selectedValue === metricName}
            key={`display-metric-${i}`}
            label={metricName}
            value={metricName}
          >
            {metricName}
          </option>
        ))}
      </select>
    );
  } else {
    displayMetrics = <p style={{ margin: 0 }}>{metricsList[0]}</p>;
  }

  return (
    <ControlWrapper title={contextTooltip}>
      <div>
        <h3>{title}</h3>
      </div>
      {displayMetrics}
    </ControlWrapper>
  );
};

const availableLineTypes: Array<{
  type: Dx.LineType;
  label: string;
}> = [
  {
    type: "line",
    label: "Line Chart"
  },
  {
    type: "stackedarea",
    label: "Stacked Area Chart"
  },
  {
    type: "stackedpercent",
    label: "Stacked Area Chart (Percent)"
  },
  {
    type: "bumparea",
    label: "Ranked Area Chart"
  }
];

const availableAreaTypes = [
  {
    type: "hexbin",
    label: "Hexbin"
  },
  {
    type: "heatmap",
    label: "Heatmap"
  },
  {
    type: "contour",
    label: "Contour Plot"
  }
];

type ChartOptions = { [key in ChartOptionTypes]: string };
interface VizControlParams {
  view: Dx.View;
  chart: Dx.Chart;
  metrics: Dx.Field[];
  dimensions: Dx.Dimension[];
  // TODO: leave "options: any" for now and improve typedef later
  updateChart: (options: any) => void;
  selectedDimensions: string[];
  selectedMetrics: string[];
  hierarchyType: Dx.HierarchyType;
  summaryType: Dx.SummaryType;
  networkType: string;
  setLineType: (lineType: Dx.LineType) => void;
  updateMetrics: (name: string) => void;
  updateDimensions: (name: string) => void;
  lineType: Dx.LineType;
  areaType: Dx.AreaType;
  setAreaType: (label: Dx.AreaType) => void;
  data: Dx.Datapoint[];
  trendLine: Dx.TrendLineType;
  marginalGraphics: Dx.SummaryType;
  barGrouping: Dx.BarGroupingType;
}
export default ({
  view,
  chart,
  metrics,
  dimensions,
  updateChart,
  selectedDimensions,
  selectedMetrics,
  hierarchyType,
  trendLine,
  marginalGraphics,
  barGrouping,
  summaryType,
  networkType,
  setLineType,
  updateMetrics,
  updateDimensions,
  lineType,
  areaType,
  setAreaType,
  data
}: VizControlParams) => {
  const metricNames = metrics.map(metric => metric.name);
  const dimensionNames = dimensions.map(dim => dim.name);

  const updateChartGenerator = (chartProperty: string) => {
    return (metricOrDim: string) =>
      updateChart({ chart: { ...chart, [chartProperty]: metricOrDim } });
  };

  const getControlHelpText = (view: string, metricOrDim: string) => {
    if (Object.keys(controlHelpText).find(mOrD => mOrD === metricOrDim)) {
      const mOrD = metricOrDim as ChartOptionTypes;
      const views =
        controlHelpText[mOrD] !== undefined ? controlHelpText[mOrD] : null;
      if (views == null) {
        return "";
      }
      if (typeof views === "string") {
        return views;
      }
      if (views[view] != null) {
        return views[view];
      } else {
        return views.default;
      }
    }
    return "";
  };

  return (
    <React.Fragment>
      <Wrapper>
        {(view === "summary" ||
          view === "scatter" ||
          view === "hexbin" ||
          view === "bar" ||
          view === "network" ||
          view === "hierarchy") &&
          metricDimSelector(
            metricNames,
            updateChartGenerator("metric1"),
            view === "scatter" || view === "hexbin" ? "X" : "Metric",
            true,
            chart.metric1,
            getControlHelpText(view, "metric1")
          )}
        {(view === "scatter" || view === "hexbin") &&
          metricDimSelector(
            metricNames,
            updateChartGenerator("metric2"),
            "Y",
            true,
            chart.metric2,
            getControlHelpText(view, "metric2")
          )}
        {((view === "scatter" && data.length < 1000) || view === "bar") &&
          metricDimSelector(
            metricNames,
            updateChartGenerator("metric3"),
            view === "bar" ? "Width" : "Size",
            false,
            chart.metric3,
            getControlHelpText(view, "metric3")
          )}
        {view === "bar" &&
          metricDimSelector(
            metricNames,
            updateChartGenerator("metric4"),
            "Error Bars",
            false,
            chart.metric4,
            getControlHelpText(view, "metric4")
          )}
        {view === "bar" &&
          metricDimSelector(
            ["Clustered", "Stacked"],
            selectedBarGrouping =>
              updateChart({ barGrouping: selectedBarGrouping }),
            "Stack or Cluster",
            true,
            barGrouping,
            controlHelpText.barGrouping as string
          )}
        {view === "scatter" &&
          metricDimSelector(
            ["boxplot", "violin", "heatmap", "ridgeline", "histogram"],
            selectedMarginalGraphics =>
              updateChart({ marginalGraphics: selectedMarginalGraphics }),
            "Marginal Graphics",
            false,
            marginalGraphics,
            controlHelpText.marginalGraphics as string
          )}

        {view === "scatter" &&
          metricDimSelector(
            ["linear", "polynomial", "power", "exponential", "logarithmic"],
            selectedRegressionType =>
              updateChart({ trendLine: selectedRegressionType }),
            "Trendline",
            false,
            trendLine,
            controlHelpText.trendLine as string
          )}
        {(view === "summary" ||
          view === "scatter" ||
          (view === "hexbin" && areaType === "contour") ||
          view === "bar" ||
          view === "parallel") &&
          metricDimSelector(
            dimensionNames,
            updateChartGenerator("dim1"),
            view === "summary" ? "Category" : "Color",
            true,
            chart.dim1,
            getControlHelpText(view, "dim1")
          )}
        {view === "scatter" &&
          metricDimSelector(
            dimensionNames,
            updateChartGenerator("dim2"),
            "Labels",
            false,
            chart.dim2,
            getControlHelpText(view, "dim2")
          )}
        {view === "hexbin" &&
          areaType === "contour" &&
          metricDimSelector(
            ["by color"],
            updateChartGenerator("dim3"),
            "Multiclass",
            false,
            chart.dim3,
            getControlHelpText(view, "dim3")
          )}
        {view === "network" &&
          metricDimSelector(
            dimensionNames,
            updateChartGenerator("dim1"),
            "SOURCE",
            true,
            chart.dim1,
            getControlHelpText(view, "dim1")
          )}
        {view === "network" &&
          metricDimSelector(
            dimensionNames,
            updateChartGenerator("dim2"),
            "TARGET",
            true,
            chart.dim2,
            getControlHelpText(view, "dim2")
          )}
        {view === "network" &&
          metricDimSelector(
            ["matrix", "arc", "force", "sankey"],
            selectedNetworkType =>
              updateChart({ networkType: selectedNetworkType }),
            "Type",
            true,
            networkType,
            controlHelpText.networkType as string
          )}
        {view === "network" &&
          metricDimSelector(
            ["static", "scaled"],
            updateChartGenerator("networkLabel"),
            "Show Labels",
            false,
            chart.networkLabel,
            controlHelpText.networkLabel as string
          )}
        {view === "hierarchy" &&
          metricDimSelector(
            ["dendrogram", "treemap", "partition", "sunburst"],
            selectedHierarchyType =>
              updateChart({ hierarchyType: selectedHierarchyType }),
            "Type",
            true,
            hierarchyType,
            controlHelpText.hierarchyType as string
          )}
        {view === "summary" &&
          metricDimSelector(
            ["violin", "boxplot", "joy", "heatmap", "histogram"],
            selectedSummaryType =>
              updateChart({ summaryType: selectedSummaryType }),
            "Type",
            true,
            summaryType,
            controlHelpText.summaryType as string
          )}
        {view === "line" &&
          metricDimSelector(
            ["array-order", ...metricNames],
            updateChartGenerator("timeseriesSort"),
            "Sort by",
            true,
            chart.timeseriesSort,
            controlHelpText.timeseriesSort as string
          )}
        {view === "line" && (
          <div
            title={controlHelpText.lineType as string}
            style={{ display: "inline-block" }}
          >
            <div>
              <h3>Chart Type</h3>
            </div>
            {availableLineTypes.map(lineTypeOption => (
              <button
                key={lineTypeOption.type}
                className={`button-text ${lineType === lineTypeOption.type &&
                  "selected"}`}
                onClick={() => setLineType(lineTypeOption.type)}
              >
                {lineTypeOption.label}
              </button>
            ))}
          </div>
        )}
        {view === "hexbin" && (
          <div
            className="control-wrapper"
            title={controlHelpText.areaType as string}
          >
            <div>
              <h3>Chart Type</h3>
            </div>
            {availableAreaTypes.map(areaTypeOption => {
              const areaTypeOptionType = areaTypeOption.type;
              if (
                areaTypeOptionType === "contour" ||
                areaTypeOptionType === "hexbin" ||
                areaTypeOptionType === "heatmap"
              ) {
                return (
                  <button
                    className={`button-text ${areaType === areaTypeOptionType &&
                      "selected"}`}
                    key={areaTypeOptionType}
                    onClick={() => setAreaType(areaTypeOptionType)}
                  >
                    {areaTypeOption.label}
                  </button>
                );
              } else {
                return <div />;
              }
            })}
          </div>
        )}
        {view === "hierarchy" && (
          <div
            className="control-wrapper"
            title={controlHelpText.nestingDimensions as string}
          >
            <div>
              <h3>Nesting</h3>
            </div>
            {selectedDimensions.length === 0
              ? "Select categories to nest"
              : `root, ${selectedDimensions.join(", ")}`}
          </div>
        )}
        {(view === "bar" || view === "hierarchy") && (
          <div
            className="control-wrapper"
            title={controlHelpText.barDimensions as string}
          >
            <div>
              <h3>Categories</h3>
            </div>
            {dimensions.map(dim => (
              <button
                key={`dimensions-select-${dim.name}`}
                className={`button-text ${selectedDimensions.indexOf(
                  dim.name
                ) !== -1 && "selected"}`}
                onClick={() => updateDimensions(dim.name)}
              >
                {dim.name}
              </button>
            ))}
          </div>
        )}
        {view === "line" && (
          <div
            className="control-wrapper"
            title={controlHelpText.lineDimensions as string}
          >
            <div>
              <h3>Metrics</h3>
            </div>
            {metrics.map(metric => (
              <button
                key={`metrics-select-${metric.name}`}
                className={`button-text ${selectedMetrics.indexOf(
                  metric.name
                ) !== -1 && "selected"}`}
                onClick={() => updateMetrics(metric.name)}
              >
                {metric.name}
              </button>
            ))}
          </div>
        )}
      </Wrapper>
    </React.Fragment>
  );
};
