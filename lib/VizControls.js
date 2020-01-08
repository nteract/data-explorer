"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var React = require("react");
var chart_docs_1 = require("./docs/chart-docs");
var styled_components_1 = require("styled-components");
var commonCSS = styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  h2 {\n    text-transform: capitalize;\n    margin-bottom: 10px;\n  }\n  select {\n    height: 30px;\n  }\n\n  .selected {\n    background-color: #d8e1e8 !important;\n    background-image: none !important;\n  }\n"], ["\n  h2 {\n    text-transform: capitalize;\n    margin-bottom: 10px;\n  }\n  select {\n    height: 30px;\n  }\n\n  .selected {\n    background-color: #d8e1e8 !important;\n    background-image: none !important;\n  }\n"])));
var ControlWrapper = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 30px;\n  ", "\n"], ["\n  margin-right: 30px;\n  ", "\n"])), commonCSS);
var Wrapper = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: left;\n  margin-bottom: 30px;\n  ", "\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: left;\n  margin-bottom: 30px;\n  ", "\n"])), commonCSS);
var metricDimSelector = function (values, selectionFunction, title, required, selectedValue, contextTooltip) {
    if (contextTooltip === void 0) { contextTooltip = "Help me help you help yourself"; }
    var metricsList = required ? values : __spreadArrays(["none"], values);
    var displayMetrics;
    if (metricsList.length > 1) {
        displayMetrics = (<select onChange={function (event) {
            selectionFunction(event.target.value);
        }} value={selectedValue}>
        {metricsList.map(function (metricName, i) { return (<option aria-selected={selectedValue === metricName} key={"display-metric-" + i} label={metricName} value={metricName}>
            {metricName}
          </option>); })}
      </select>);
    }
    else {
        displayMetrics = <p style={{ margin: 0 }}>{metricsList[0]}</p>;
    }
    return (<ControlWrapper title={contextTooltip}>
      <div>
        <h3>{title}</h3>
      </div>
      {displayMetrics}
    </ControlWrapper>);
};
var availableLineTypes = [
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
var availableAreaTypes = [
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
exports["default"] = (function (_a) {
    var view = _a.view, chart = _a.chart, metrics = _a.metrics, dimensions = _a.dimensions, updateChart = _a.updateChart, selectedDimensions = _a.selectedDimensions, selectedMetrics = _a.selectedMetrics, hierarchyType = _a.hierarchyType, trendLine = _a.trendLine, marginalGraphics = _a.marginalGraphics, barGrouping = _a.barGrouping, summaryType = _a.summaryType, networkType = _a.networkType, setLineType = _a.setLineType, updateMetrics = _a.updateMetrics, updateDimensions = _a.updateDimensions, lineType = _a.lineType, areaType = _a.areaType, setAreaType = _a.setAreaType, data = _a.data;
    var metricNames = metrics.map(function (metric) { return metric.name; });
    var dimensionNames = dimensions.map(function (dim) { return dim.name; });
    var updateChartGenerator = function (chartProperty) {
        return function (metricOrDim) {
            var _a;
            return updateChart({ chart: __assign(__assign({}, chart), (_a = {}, _a[chartProperty] = metricOrDim, _a)) });
        };
    };
    var getControlHelpText = function (view, metricOrDim) {
        if (Object.keys(chart_docs_1.controlHelpText).find(function (mOrD) { return mOrD === metricOrDim; })) {
            var mOrD = metricOrDim;
            var views = chart_docs_1.controlHelpText[mOrD] !== undefined ? chart_docs_1.controlHelpText[mOrD] : null;
            if (views == null) {
                return "";
            }
            if (typeof views === "string") {
                return views;
            }
            if (views[view] != null) {
                return views[view];
            }
            else {
                return views["default"];
            }
        }
        return "";
    };
    return (<React.Fragment>
      <Wrapper>
        {(view === "summary" ||
        view === "scatter" ||
        view === "hexbin" ||
        view === "bar" ||
        view === "network" ||
        view === "hierarchy") &&
        metricDimSelector(metricNames, updateChartGenerator("metric1"), view === "scatter" || view === "hexbin" ? "X" : "Metric", true, chart.metric1, getControlHelpText(view, "metric1"))}
        {(view === "scatter" || view === "hexbin") &&
        metricDimSelector(metricNames, updateChartGenerator("metric2"), "Y", true, chart.metric2, getControlHelpText(view, "metric2"))}
        {((view === "scatter" && data.length < 1000) || view === "bar") &&
        metricDimSelector(metricNames, updateChartGenerator("metric3"), view === "bar" ? "Width" : "Size", false, chart.metric3, getControlHelpText(view, "metric3"))}
        {view === "bar" &&
        metricDimSelector(metricNames, updateChartGenerator("metric4"), "Error Bars", false, chart.metric4, getControlHelpText(view, "metric4"))}
        {view === "bar" &&
        metricDimSelector(["Clustered", "Stacked"], function (selectedBarGrouping) {
            return updateChart({ barGrouping: selectedBarGrouping });
        }, "Stack or Cluster", true, barGrouping, chart_docs_1.controlHelpText.barGrouping)}
        {view === "scatter" &&
        metricDimSelector(["boxplot", "violin", "heatmap", "ridgeline", "histogram"], function (selectedMarginalGraphics) {
            return updateChart({ marginalGraphics: selectedMarginalGraphics });
        }, "Marginal Graphics", false, marginalGraphics, chart_docs_1.controlHelpText.marginalGraphics)}

        {view === "scatter" &&
        metricDimSelector(["linear", "polynomial", "power", "exponential", "logarithmic"], function (selectedRegressionType) {
            return updateChart({ trendLine: selectedRegressionType });
        }, "Trendline", false, trendLine, chart_docs_1.controlHelpText.trendLine)}
        {(view === "summary" ||
        view === "scatter" ||
        (view === "hexbin" && areaType === "contour") ||
        view === "bar" ||
        view === "parallel") &&
        metricDimSelector(dimensionNames, updateChartGenerator("dim1"), view === "summary" ? "Category" : "Color", true, chart.dim1, getControlHelpText(view, "dim1"))}
        {view === "scatter" &&
        metricDimSelector(dimensionNames, updateChartGenerator("dim2"), "Labels", false, chart.dim2, getControlHelpText(view, "dim2"))}
        {view === "hexbin" &&
        areaType === "contour" &&
        metricDimSelector(["by color"], updateChartGenerator("dim3"), "Multiclass", false, chart.dim3, getControlHelpText(view, "dim3"))}
        {view === "network" &&
        metricDimSelector(dimensionNames, updateChartGenerator("dim1"), "SOURCE", true, chart.dim1, getControlHelpText(view, "dim1"))}
        {view === "network" &&
        metricDimSelector(dimensionNames, updateChartGenerator("dim2"), "TARGET", true, chart.dim2, getControlHelpText(view, "dim2"))}
        {view === "network" &&
        metricDimSelector(["matrix", "arc", "force", "sankey"], function (selectedNetworkType) {
            return updateChart({ networkType: selectedNetworkType });
        }, "Type", true, networkType, chart_docs_1.controlHelpText.networkType)}
        {view === "network" &&
        metricDimSelector(["static", "scaled"], updateChartGenerator("networkLabel"), "Show Labels", false, chart.networkLabel, chart_docs_1.controlHelpText.networkLabel)}
        {view === "hierarchy" &&
        metricDimSelector(["dendrogram", "treemap", "partition", "sunburst"], function (selectedHierarchyType) {
            return updateChart({ hierarchyType: selectedHierarchyType });
        }, "Type", true, hierarchyType, chart_docs_1.controlHelpText.hierarchyType)}
        {view === "summary" &&
        metricDimSelector(["violin", "boxplot", "joy", "heatmap", "histogram"], function (selectedSummaryType) {
            return updateChart({ summaryType: selectedSummaryType });
        }, "Type", true, summaryType, chart_docs_1.controlHelpText.summaryType)}
        {view === "line" &&
        metricDimSelector(__spreadArrays(["array-order"], metricNames), updateChartGenerator("timeseriesSort"), "Sort by", true, chart.timeseriesSort, chart_docs_1.controlHelpText.timeseriesSort)}
        {view === "line" && (<div title={chart_docs_1.controlHelpText.lineType} style={{ display: "inline-block" }}>
            <div>
              <h3>Chart Type</h3>
            </div>
            {availableLineTypes.map(function (lineTypeOption) { return (<button key={lineTypeOption.type} className={"button-text " + (lineType === lineTypeOption.type &&
        "selected")} onClick={function () { return setLineType(lineTypeOption.type); }}>
                {lineTypeOption.label}
              </button>); })}
          </div>)}
        {view === "hexbin" && (<div className="control-wrapper" title={chart_docs_1.controlHelpText.areaType}>
            <div>
              <h3>Chart Type</h3>
            </div>
            {availableAreaTypes.map(function (areaTypeOption) {
        var areaTypeOptionType = areaTypeOption.type;
        if (areaTypeOptionType === "contour" ||
            areaTypeOptionType === "hexbin" ||
            areaTypeOptionType === "heatmap") {
            return (<button className={"button-text " + (areaType === areaTypeOptionType &&
                "selected")} key={areaTypeOptionType} onClick={function () { return setAreaType(areaTypeOptionType); }}>
                    {areaTypeOption.label}
                  </button>);
        }
        else {
            return <div />;
        }
    })}
          </div>)}
        {view === "hierarchy" && (<div className="control-wrapper" title={chart_docs_1.controlHelpText.nestingDimensions}>
            <div>
              <h3>Nesting</h3>
            </div>
            {selectedDimensions.length === 0
        ? "Select categories to nest"
        : "root, " + selectedDimensions.join(", ")}
          </div>)}
        {(view === "bar" || view === "hierarchy") && (<div className="control-wrapper" title={chart_docs_1.controlHelpText.barDimensions}>
            <div>
              <h3>Categories</h3>
            </div>
            {dimensions.map(function (dim) { return (<button key={"dimensions-select-" + dim.name} className={"button-text " + (selectedDimensions.indexOf(dim.name) !== -1 && "selected")} onClick={function () { return updateDimensions(dim.name); }}>
                {dim.name}
              </button>); })}
          </div>)}
        {view === "line" && (<div className="control-wrapper" title={chart_docs_1.controlHelpText.lineDimensions}>
            <div>
              <h3>Metrics</h3>
            </div>
            {metrics.map(function (metric) { return (<button key={"metrics-select-" + metric.name} className={"button-text " + (selectedMetrics.indexOf(metric.name) !== -1 && "selected")} onClick={function () { return updateMetrics(metric.name); }}>
                {metric.name}
              </button>); })}
          </div>)}
      </Wrapper>
    </React.Fragment>);
});
var templateObject_1, templateObject_2, templateObject_3;
