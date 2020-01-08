"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var grid_1 = require("./charts/grid");
var settings_1 = require("./charts/settings");
var Toolbar_1 = require("./components/Toolbar");
exports.Toolbar = Toolbar_1.Toolbar;
var Viz_1 = require("./components/Viz");
exports.Viz = Viz_1.Viz;
var settings_2 = require("./settings");
var VizControls_1 = require("./VizControls");
var mediaType = "application/vnd.dataresource+json";
var styled_components_1 = require("styled-components");
var Dx = require("./types");
var generateChartKey = function (_a) {
    var view = _a.view, lineType = _a.lineType, areaType = _a.areaType, selectedDimensions = _a.selectedDimensions, selectedMetrics = _a.selectedMetrics, pieceType = _a.pieceType, summaryType = _a.summaryType, networkType = _a.networkType, hierarchyType = _a.hierarchyType, trendLine = _a.trendLine, marginalGraphics = _a.marginalGraphics, barGrouping = _a.barGrouping, chart = _a.chart;
    return view + "-" + lineType + "-" + areaType + "-" + selectedDimensions.join(",") + "-" + selectedMetrics.join(",") + "-" + pieceType + "-" + summaryType + "-" + networkType + "-" + hierarchyType + "-" + trendLine + "-" + marginalGraphics + "-" + barGrouping + "-" + JSON.stringify(chart);
};
/*
  contour is an option for scatterplot
  pie is a transform on bar
*/
var defaultResponsiveSize = [500, 300];
var MetadataWarningWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & {\n    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;\n  }\n"], ["\n  & {\n    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;\n  }\n"])));
var MetadataWarningContent = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  & {\n    backgroundcolor: #cce;\n    padding: 10px;\n    paddingleft: 20px;\n  }\n"], ["\n  & {\n    backgroundcolor: #cce;\n    padding: 10px;\n    paddingleft: 20px;\n  }\n"])));
var MetadataWarning = function (_a) {
    var metadata = _a.metadata;
    var warning = metadata && metadata.sampled ? (<span>
        <b>NOTE:</b> This data is sampled
      </span>) : null;
    return (<MetadataWarningWrapper>
      {warning ? (<MetadataWarningContent>{warning}</MetadataWarningContent>) : null}
    </MetadataWarningWrapper>);
};
var FlexWrapper = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: row nowrap;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-flow: row nowrap;\n  width: 100%;\n"])));
var SemioticWrapper = styled_components_1["default"].div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 100%;\n  .html-legend-item {\n    color: var(--theme-app-fg);\n  }\n\n  .tick > path {\n    stroke: lightgray;\n  }\n\n  .axis-labels,\n  .ordinal-labels {\n    fill: var(--theme-app-fg);\n    font-size: 14px;\n  }\n\n  path.connector,\n  path.connector-end {\n    stroke: var(--theme-app-fg);\n  }\n\n  path.connector-end {\n    fill: var(--theme-app-fg);\n  }\n\n  text.annotation-note-label,\n  text.legend-title,\n  .legend-item text {\n    fill: var(--theme-app-fg);\n    stroke: none;\n  }\n\n  .xyframe-area > path {\n    stroke: var(--theme-app-fg);\n  }\n\n  .axis-baseline {\n    stroke-opacity: 0.25;\n    stroke: var(--theme-app-fg);\n  }\n  circle.frame-hover {\n    fill: none;\n    stroke: gray;\n  }\n  .rect {\n    stroke: green;\n    stroke-width: 5px;\n    stroke-opacity: 0.5;\n  }\n  rect.selection {\n    opacity: 0.5;\n  }\n"], ["\n  width: 100%;\n  .html-legend-item {\n    color: var(--theme-app-fg);\n  }\n\n  .tick > path {\n    stroke: lightgray;\n  }\n\n  .axis-labels,\n  .ordinal-labels {\n    fill: var(--theme-app-fg);\n    font-size: 14px;\n  }\n\n  path.connector,\n  path.connector-end {\n    stroke: var(--theme-app-fg);\n  }\n\n  path.connector-end {\n    fill: var(--theme-app-fg);\n  }\n\n  text.annotation-note-label,\n  text.legend-title,\n  .legend-item text {\n    fill: var(--theme-app-fg);\n    stroke: none;\n  }\n\n  .xyframe-area > path {\n    stroke: var(--theme-app-fg);\n  }\n\n  .axis-baseline {\n    stroke-opacity: 0.25;\n    stroke: var(--theme-app-fg);\n  }\n  circle.frame-hover {\n    fill: none;\n    stroke: gray;\n  }\n  .rect {\n    stroke: green;\n    stroke-width: 5px;\n    stroke-opacity: 0.5;\n  }\n  rect.selection {\n    opacity: 0.5;\n  }\n"])));
var DataExplorer = /** @class */ (function (_super) {
    __extends(DataExplorer, _super);
    function DataExplorer(props) {
        var _this = _super.call(this, props) || this;
        _this.updateChart = function (updatedState) {
            var _a = __assign(__assign({}, _this.state), updatedState), view = _a.view, dimensions = _a.dimensions, metrics = _a.metrics, chart = _a.chart, lineType = _a.lineType, areaType = _a.areaType, selectedDimensions = _a.selectedDimensions, selectedMetrics = _a.selectedMetrics, pieceType = _a.pieceType, summaryType = _a.summaryType, networkType = _a.networkType, hierarchyType = _a.hierarchyType, trendLine = _a.trendLine, marginalGraphics = _a.marginalGraphics, barGrouping = _a.barGrouping, colors = _a.colors, primaryKey = _a.primaryKey, stateData = _a.data;
            if (!_this.props.data && !_this.props.metadata && !_this.props.initialView) {
                return;
            }
            var _b = _this.props, data = _b.data, height = _b.height;
            var _c = settings_1.semioticSettings[view], Frame = _c.Frame, chartGenerator = _c.chartGenerator;
            var chartKey = generateChartKey({
                view: view,
                lineType: lineType,
                areaType: areaType,
                selectedDimensions: selectedDimensions,
                selectedMetrics: selectedMetrics,
                pieceType: pieceType,
                summaryType: summaryType,
                networkType: networkType,
                hierarchyType: hierarchyType,
                chart: chart,
                trendLine: trendLine,
                marginalGraphics: marginalGraphics,
                barGrouping: barGrouping
            });
            var frameSettings = chartGenerator(stateData, data.schema, {
                metrics: metrics,
                dimensions: dimensions,
                chart: chart,
                colors: colors,
                height: height,
                lineType: lineType,
                areaType: areaType,
                selectedDimensions: selectedDimensions,
                selectedMetrics: selectedMetrics,
                pieceType: pieceType,
                summaryType: summaryType,
                networkType: networkType,
                hierarchyType: hierarchyType,
                primaryKey: primaryKey,
                trendLine: trendLine,
                marginalGraphics: marginalGraphics,
                barGrouping: barGrouping,
                setColor: _this.setColor
            });
            var display = (<SemioticWrapper>
        <Frame responsiveWidth size={defaultResponsiveSize} {...frameSettings}/>
        <VizControls_1["default"] {...{
                data: stateData,
                view: view,
                chart: chart,
                metrics: metrics,
                dimensions: dimensions,
                selectedDimensions: selectedDimensions,
                selectedMetrics: selectedMetrics,
                hierarchyType: hierarchyType,
                summaryType: summaryType,
                networkType: networkType,
                trendLine: trendLine,
                marginalGraphics: marginalGraphics,
                barGrouping: barGrouping,
                updateChart: _this.updateChart,
                updateDimensions: _this.updateDimensions,
                setLineType: _this.setLineType,
                updateMetrics: _this.updateMetrics,
                lineType: lineType,
                setAreaType: _this.setAreaType,
                areaType: areaType
            }}/>
      </SemioticWrapper>);
            // If you pass an onMetadataChange function, then fire it and pass the updated dx settings so someone upstream can update the metadata or otherwise use it
            _this.updateMetadata({
                view: view,
                lineType: lineType,
                areaType: areaType,
                selectedDimensions: selectedDimensions,
                selectedMetrics: selectedMetrics,
                pieceType: pieceType,
                summaryType: summaryType,
                networkType: networkType,
                hierarchyType: hierarchyType,
                trendLine: trendLine,
                marginalGraphics: marginalGraphics,
                barGrouping: barGrouping,
                colors: colors,
                chart: chart
            });
            _this.setState(function (prevState) {
                var _a;
                return __assign(__assign({}, updatedState), { displayChart: __assign(__assign({}, prevState.displayChart), (_a = {}, _a[chartKey] = display, _a)) });
            });
        };
        _this.setView = function (view) {
            _this.updateChart({ view: view });
        };
        _this.updateMetadata = function (overrideProps) {
            var _a = _this.props, onMetadataChange = _a.onMetadataChange, metadata = _a.metadata;
            var _b = _this.state, view = _b.view, lineType = _b.lineType, areaType = _b.areaType, selectedDimensions = _b.selectedDimensions, selectedMetrics = _b.selectedMetrics, pieceType = _b.pieceType, summaryType = _b.summaryType, networkType = _b.networkType, hierarchyType = _b.hierarchyType, trendLine = _b.trendLine, marginalGraphics = _b.marginalGraphics, barGrouping = _b.barGrouping, colors = _b.colors, chart = _b.chart;
            if (onMetadataChange) {
                onMetadataChange(__assign(__assign({}, metadata), { dx: __assign({ view: view,
                        lineType: lineType,
                        areaType: areaType,
                        selectedDimensions: selectedDimensions,
                        selectedMetrics: selectedMetrics,
                        pieceType: pieceType,
                        summaryType: summaryType,
                        networkType: networkType,
                        hierarchyType: hierarchyType,
                        trendLine: trendLine,
                        marginalGraphics: marginalGraphics,
                        barGrouping: barGrouping,
                        colors: colors,
                        chart: chart }, overrideProps) }), mediaType);
            }
        };
        _this.setGrid = function () {
            _this.updateMetadata({ view: "grid" });
            _this.setState({ view: "grid" });
        };
        _this.setColor = function (newColorArray) {
            _this.updateChart({ colors: newColorArray });
        };
        _this.setLineType = function (selectedLineType) {
            _this.updateChart({ lineType: selectedLineType });
        };
        _this.setAreaType = function (selectedAreaType) {
            _this.updateChart({ areaType: selectedAreaType });
        };
        _this.updateDimensions = function (selectedDimension) {
            var oldDims = _this.state.selectedDimensions;
            var newDimensions = oldDims.indexOf(selectedDimension) === -1
                ? __spreadArrays(oldDims, [selectedDimension]) : oldDims.filter(function (dimension) { return dimension !== selectedDimension; });
            _this.updateChart({ selectedDimensions: newDimensions });
        };
        _this.updateMetrics = function (selectedMetric) {
            var oldMetrics = _this.state.selectedMetrics;
            var newMetrics = oldMetrics.indexOf(selectedMetric) === -1
                ? __spreadArrays(oldMetrics, [selectedMetric]) : oldMetrics.filter(function (metric) { return metric !== selectedMetric; });
            _this.updateChart({ selectedMetrics: newMetrics });
        };
        var metadata = props.metadata, initialView = props.initialView;
        // Handle case of metadata being empty yet dx not set
        var dx = metadata.dx || {};
        var chart = dx.chart || {};
        var _a = props.data.schema, _b = _a.fields, fields = _b === void 0 ? [] : _b, _c = _a.primaryKey, primaryKey = _c === void 0 ? [] : _c;
        // Provide a default primaryKey if none provided
        if (primaryKey.length === 0) {
            primaryKey = [Dx.defaultPrimaryKey];
            fields = __spreadArrays(fields, [{ name: Dx.defaultPrimaryKey, type: "integer" }]);
        }
        var dimensions = fields
            .filter(function (field) {
            return field.type === "string" ||
                field.type === "boolean" ||
                field.type === "datetime";
        })
            .map(function (field) { return (__assign(__assign({}, field), { cardinality: 0 })); });
        // Should datetime data types be transformed into js dates before getting to this resource?
        var data = props.data.data.map(function (datapoint, datapointIndex) {
            var mappedDatapoint = __assign({}, datapoint);
            fields.forEach(function (field) {
                if (field.name === Dx.defaultPrimaryKey) {
                    mappedDatapoint[Dx.defaultPrimaryKey] = datapointIndex;
                }
                if (field.type === "datetime") {
                    mappedDatapoint[field.name] = new Date(mappedDatapoint[field.name]);
                }
            });
            return mappedDatapoint;
        });
        var largeDataset = true;
        var selectedDimensions = [];
        if (data.length < 5000) {
            largeDataset = false;
            var cardinalityHash_1 = {};
            dimensions.forEach(function (dim) {
                cardinalityHash_1[dim.name] = {};
                data.forEach(function (datapoint) {
                    var dimValue = datapoint[dim.name];
                    cardinalityHash_1[dim.name][dimValue] = true;
                });
                dim.cardinality = Object.entries(cardinalityHash_1[dim.name]).length;
            });
            selectedDimensions = dimensions
                .sort(function (a, b) { return a.cardinality - b.cardinality; })
                .filter(function (data, index) { return index === 0; })
                .map(function (dim) { return dim.name; });
        }
        var metrics = fields
            .filter(function (field) {
            return field.type === "integer" ||
                field.type === "number" ||
                field.type === "datetime";
        })
            .filter(function (field) { return !primaryKey.find(function (pkey) { return pkey === field.name; }); });
        var displayChart = {};
        _this.state = __assign({ largeDataset: largeDataset, view: initialView, lineType: "line", areaType: "hexbin", trendLine: "none", marginalGraphics: "none", barGrouping: "Clustered", selectedDimensions: selectedDimensions, selectedMetrics: [], pieceType: "bar", summaryType: "violin", networkType: "force", hierarchyType: "dendrogram", dimensions: dimensions,
            metrics: metrics,
            colors: settings_2.colors, 
            // ui: {},
            chart: __assign({ metric1: (metrics[0] && metrics[0].name) || "none", metric2: (metrics[1] && metrics[1].name) || "none", metric3: "none", metric4: "none", dim1: (dimensions[0] && dimensions[0].name) || "none", dim2: (dimensions[1] && dimensions[1].name) || "none", dim3: "none", timeseriesSort: "array-order", networkLabel: "none" }, chart), displayChart: displayChart,
            primaryKey: primaryKey,
            data: data }, dx);
        return _this;
    }
    DataExplorer.prototype.componentDidMount = function () {
        // This is necessary to render any charts based on passed metadata because the grid doesn't result from the updateChart function but any other view does
        if (this.state.view !== "grid") {
            this.updateChart(this.state);
        }
    };
    DataExplorer.prototype.render = function () {
        var _this = this;
        var _a = this.state, view = _a.view, dimensions = _a.dimensions, chart = _a.chart, lineType = _a.lineType, areaType = _a.areaType, selectedDimensions = _a.selectedDimensions, selectedMetrics = _a.selectedMetrics, pieceType = _a.pieceType, summaryType = _a.summaryType, networkType = _a.networkType, hierarchyType = _a.hierarchyType, trendLine = _a.trendLine, marginalGraphics = _a.marginalGraphics, barGrouping = _a.barGrouping, largeDataset = _a.largeDataset;
        var display = null;
        if (view === "grid") {
            display = <grid_1["default"] {...this.props}/>;
        }
        else if ([
            "line",
            "scatter",
            "bar",
            "network",
            "summary",
            "hierarchy",
            "hexbin",
            "parallel"
        ].includes(view)) {
            var chartKey = generateChartKey({
                view: view,
                lineType: lineType,
                areaType: areaType,
                selectedDimensions: selectedDimensions,
                selectedMetrics: selectedMetrics,
                pieceType: pieceType,
                summaryType: summaryType,
                networkType: networkType,
                hierarchyType: hierarchyType,
                chart: chart,
                trendLine: trendLine,
                marginalGraphics: marginalGraphics,
                barGrouping: barGrouping
            });
            display = this.state.displayChart[chartKey];
        }
        var children = React.Children.map(this.props.children, function (child) {
            if (!React.isValidElement(child)) {
                return;
            }
            var componentType = child.props.componentType;
            if (componentType === "viz") {
                var newProps = { children: display };
                return React.cloneElement(child, newProps);
            }
            else if (componentType === "toolbar") {
                var toolbarProps = {
                    dimensions: dimensions,
                    currentView: view,
                    setGrid: _this.setGrid,
                    setView: _this.setView,
                    largeDataset: largeDataset
                };
                return React.cloneElement(child, toolbarProps);
            }
            return child;
        });
        return (<div>
        <MetadataWarning metadata={this.props.metadata}/>
        <FlexWrapper>{children}</FlexWrapper>
      </div>);
    };
    DataExplorer.MIMETYPE = mediaType;
    DataExplorer.defaultProps = {
        metadata: {
            dx: {}
        },
        height: 500,
        mediaType: mediaType,
        initialView: "grid"
    };
    return DataExplorer;
}(React.PureComponent));
exports.DataExplorer = DataExplorer;
var DataExplorerDefault = function (props) {
    return (<DataExplorer {...props}>
      <Viz_1.Viz />
      <Toolbar_1.Toolbar />
    </DataExplorer>);
};
DataExplorerDefault.defaultProps = {
    mediaType: mediaType
};
DataExplorerDefault.displayName = "DataExplorerDefault";
// For the jupyter extension to load MIMETYPE must be present.
DataExplorerDefault.MIMETYPE = mediaType;
exports["default"] = DataExplorerDefault;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
