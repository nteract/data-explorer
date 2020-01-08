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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var d3_scale_1 = require("d3-scale");
var React = require("react");
var semiotic_1 = require("semiotic");
var HTMLLegend_1 = require("./HTMLLegend");
var tooltip_content_1 = require("./tooltip-content");
var utilities_1 = require("./utilities");
var styled_components_1 = require("styled-components");
var NumberOfItemsP = styled_components_1["default"].p(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 20px 0 5px;\n"], ["\n  margin: 20px 0 5px;\n"])));
var ParCoordsAxisTickG = styled_components_1["default"].g(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  & text {\n    text-anchor: end;\n  }\n\n  & :first-child {\n    fill: white;\n    stroke: white;\n    opacity: 0.75;\n    stroke-width: 2;\n  }\n"], ["\n  & text {\n    text-anchor: end;\n  }\n\n  & :first-child {\n    fill: white;\n    stroke: white;\n    opacity: 0.75;\n    stroke-width: 2;\n  }\n"])));
var axisSize = [40, 380];
function parallelizeData(data, metrics, schemaFields, primaryKey) {
    var minmax = {};
    var screenScales = {};
    metrics.forEach(function (metric) {
        var dataExtent = [
            Math.min.apply(Math, data.map(function (datapoint) { return datapoint[metric.name]; })),
            Math.max.apply(Math, data.map(function (datapoint) { return datapoint[metric.name]; }))
        ];
        var minMaxScale = d3_scale_1.scaleLinear()
            .domain(dataExtent)
            .range([0, 1]);
        minmax[metric.name] = minMaxScale;
        var screenScale = d3_scale_1.scaleLinear()
            .domain(dataExtent)
            .range([380, 0]);
        screenScales[metric.name] = screenScale;
    });
    var dataPieces = [];
    data.forEach(function (datapoint) {
        metrics.forEach(function (metric) {
            var dataPiece = {
                metric: metric.name,
                rawvalue: datapoint[metric.name],
                pctvalue: minmax[metric.name](datapoint[metric.name])
            };
            schemaFields.forEach(function (field) {
                if (field.type === "string") {
                    dataPiece[field.name] = datapoint[field.name];
                }
            });
            primaryKey.forEach(function (key) {
                dataPiece[key] = datapoint[key];
            });
            dataPieces.push(dataPiece);
        });
    });
    return { dataPieces: dataPieces, scales: screenScales };
}
var ParallelCoordinatesController = /** @class */ (function (_super) {
    __extends(ParallelCoordinatesController, _super);
    function ParallelCoordinatesController(props) {
        var _this = _super.call(this, props) || this;
        _this.brushing = function (selectedExtent, columnName) {
            var columnExtent = _this.state.columnExtent;
            columnExtent[columnName] = selectedExtent;
            _this.setState({ columnExtent: columnExtent });
        };
        var _a = _this.props, options = _a.options, data = _a.data, schema = _a.schema;
        var primaryKey = options.primaryKey;
        var parallelizeResults = parallelizeData(data, options.metrics, schema.fields, primaryKey);
        _this.state = {
            filterMode: true,
            data: parallelizeResults.dataPieces,
            dataScales: parallelizeResults.scales,
            columnExtent: options.metrics.reduce(function (metricHash, metric) {
                metricHash[metric.name] = [-Infinity, Infinity];
                return metricHash;
            }, {})
        };
        return _this;
    }
    ParallelCoordinatesController.prototype.shouldComponentUpdate = function () {
        return true;
    };
    ParallelCoordinatesController.prototype.render = function () {
        var _this = this;
        var _a = this.props, options = _a.options, data = _a.data;
        var primaryKey = options.primaryKey, metrics = options.metrics, chart = options.chart, colors = options.colors, setColor = options.setColor;
        var dim1 = chart.dim1;
        var _b = this.state, columnExtent = _b.columnExtent, filterMode = _b.filterMode;
        var hiddenHash = new Map();
        var connectorFunction = function (columnDatapoint) {
            return primaryKey.map(function (key) { return columnDatapoint[key]; }).join(",");
        };
        Object.keys(columnExtent).forEach(function (key) {
            var extent = columnExtent[key].sort(function (a, b) { return a - b; });
            _this.state.data
                .filter(function (datapoint) {
                return datapoint.metric === key &&
                    (datapoint.pctvalue < extent[0] || datapoint.pctvalue > extent[1]);
            })
                .forEach(function (datapoint) {
                hiddenHash.set(primaryKey.map(function (key) { return datapoint[key]; }).join(","), true);
            });
        });
        var additionalSettings = {};
        var shownData = data.filter(function (datapoint) {
            return !hiddenHash.get(primaryKey.map(function (key) { return datapoint[key]; }).join(","));
        });
        var filteredData = shownData.map(function (datapoint) {
            return primaryKey.map(function (key) { return datapoint[key]; }).join(" - ");
        });
        var colorHash = { Other: "grey" };
        if (dim1 && dim1 !== "none") {
            var _c = shownData.reduce(function (valueReducer, datapoint) {
                var value = datapoint[dim1];
                valueReducer.valueHash[value] =
                    (valueReducer.valueHash[value] &&
                        valueReducer.valueHash[value] + 1) ||
                        1;
                valueReducer.uniqueValues =
                    (!valueReducer.uniqueValues.find(function (uniqueValue) { return uniqueValue === value; }) && __spreadArrays(valueReducer.uniqueValues, [value])) ||
                        valueReducer.uniqueValues;
                return valueReducer;
            }, { uniqueValues: [], valueHash: {} }), uniqueValues = _c.uniqueValues, valueHash = _c.valueHash;
            var uniqueDimsForColors = data.reduce(function (colorArray, datapoint) {
                return colorArray.indexOf(datapoint[dim1]) === -1
                    ? __spreadArrays(colorArray, [datapoint[dim1]]) : colorArray;
            }, []);
            uniqueDimsForColors.forEach(function (value, index) {
                colorHash[value] = colors[index % colors.length];
            });
            additionalSettings.afterElements =
                uniqueValues.length <= 18 ? (<HTMLLegend_1["default"] values={uniqueValues} colorHash={colorHash} valueHash={valueHash} setColor={setColor}/>) : (<NumberOfItemsP>{filteredData.length} items</NumberOfItemsP>);
        }
        if (!filterMode) {
            additionalSettings.annotations = metrics
                .map(function (metric) { return ({
                label: "",
                metric: metric.name,
                type: "enclose-rect",
                color: "green",
                disable: ["connector"],
                coordinates: [
                    { metric: metric.name, pctvalue: columnExtent[metric.name][0] },
                    { metric: metric.name, pctvalue: columnExtent[metric.name][1] }
                ]
            }); })
                .filter(function (annotation) {
                return annotation.coordinates[0].pctvalue !== 0 ||
                    annotation.coordinates[1].pctvalue !== 1;
            });
        }
        return (<div>
        <div>
          <button className={"button-text " + (filterMode ? "selected" : "")} onClick={function () { return _this.setState({ filterMode: true }); }}>
            Filter
          </button>
          <button className={"button-text " + (filterMode ? "" : "selected")} onClick={function () { return _this.setState({ filterMode: false }); }}>
            Explore
          </button>
        </div>
        <semiotic_1.ResponsiveOrdinalFrame data={this.state.data} oAccessor="metric" rAccessor="pctvalue" type={{
            type: "point",
            r: 2
        }} connectorType={connectorFunction} style={function (datapoint) { return ({
            fill: hiddenHash.get(primaryKey.map(function (key) { return datapoint[key]; }).join(","))
                ? "lightgray"
                : colorHash[datapoint[dim1]],
            opacity: hiddenHash.get(primaryKey.map(function (key) { return datapoint[key]; }).join(","))
                ? 0.15
                : 0.99
        }); }} connectorStyle={function (datapoint) { return ({
            stroke: hiddenHash.get(primaryKey.map(function (key) { return datapoint.source[key]; }).join(","))
                ? "gray"
                : colorHash[datapoint.source[dim1]],
            strokeWidth: hiddenHash.get(primaryKey.map(function (key) { return datapoint.source[key]; }).join(","))
                ? 1
                : 1.5,
            strokeOpacity: hiddenHash.get(primaryKey.map(function (key) { return datapoint.source[key]; }).join(","))
                ? 0.1
                : 1
        }); }} responsiveWidth margin={{ top: 20, left: 20, right: 20, bottom: 100 }} oPadding={40} pixelColumnWidth={80} interaction={filterMode
            ? {
                columnsBrush: true,
                during: this.brushing,
                extent: Object.keys(this.state.columnExtent)
            }
            : null} pieceHoverAnnotation={!filterMode} tooltipContent={function (hoveredDatapoint) {
            var textColor = hiddenHash.get(primaryKey.map(function (key) { return hoveredDatapoint[key]; }).join(","))
                ? "grey"
                : colorHash[hoveredDatapoint[dim1]];
            return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
                <h3>
                  {primaryKey
                .map(function (key) { return hoveredDatapoint[key]; })
                .join(", ")}
                </h3>
                {hoveredDatapoint[dim1] && (<h3 style={{ color: textColor }}>
                    {dim1}: {hoveredDatapoint[dim1]}
                  </h3>)}
                <p>
                  {hoveredDatapoint.metric}: {hoveredDatapoint.rawvalue}
                </p>
              </tooltip_content_1["default"]>);
        }} canvasPieces canvasConnectors oLabel={function (columnLabel) { return (<g>
              <text transform="rotate(45)">{columnLabel}</text>
              <g transform="translate(-20,-395)">
                <semiotic_1.Axis scale={_this.state.dataScales[columnLabel]} size={axisSize} orient="left" ticks={5} tickFormat={function (tickValue) { return (<ParCoordsAxisTickG>
                      <text>{utilities_1.numeralFormatting(tickValue)}</text>
                      <text>{utilities_1.numeralFormatting(tickValue)}</text>
                    </ParCoordsAxisTickG>); }}/>
              </g>
            </g>); }} {...additionalSettings}/>
      </div>);
    };
    ParallelCoordinatesController.defaultProps = {
        metadata: {},
        height: 500
    };
    return ParallelCoordinatesController;
}(React.Component));
exports["default"] = ParallelCoordinatesController;
var templateObject_1, templateObject_2;
