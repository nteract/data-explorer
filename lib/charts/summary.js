"use strict";
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
var d3_scale_1 = require("d3-scale");
var React = require("react");
var HTMLLegend_1 = require("../HTMLLegend");
var tooltip_content_1 = require("../tooltip-content");
var utilities_1 = require("../utilities");
var fontScale = d3_scale_1.scaleLinear()
    .domain([8, 25])
    .range([14, 8])
    .clamp(true);
exports.semioticSummaryChart = function (data, schema, options) {
    var additionalSettings = {};
    var colorHash = {};
    var chart = options.chart, summaryType = options.summaryType, primaryKey = options.primaryKey, colors = options.colors, setColor = options.setColor;
    var dim1 = chart.dim1, metric1 = chart.metric1;
    var oAccessor = dim1;
    var rAccessor = metric1;
    var uniqueValues = data.reduce(function (uniqueArray, datapoint) {
        return (!uniqueArray.find(function (dimValue) { return dimValue === datapoint[dim1].toString(); }) && __spreadArrays(uniqueArray, [datapoint[dim1].toString()])) ||
            uniqueArray;
    }, []);
    if (dim1 && dim1 !== "none") {
        uniqueValues.forEach(function (dimValue, index) {
            colorHash[dimValue] = colors[index % colors.length];
        });
        additionalSettings.afterElements = (<HTMLLegend_1["default"] valueHash={{}} values={uniqueValues} colorHash={colorHash} setColor={setColor} colors={colors}/>);
    }
    var summarySettings = __assign({ summaryType: { type: summaryType, bins: 16, amplitude: 20 }, type: summaryType === "violin" && "swarm", projection: "horizontal", data: data,
        oAccessor: oAccessor,
        rAccessor: rAccessor, summaryStyle: function (summaryDatapoint) { return ({
            fill: colorHash[summaryDatapoint[dim1]] || colors[0],
            fillOpacity: 0.8,
            stroke: colorHash[summaryDatapoint[dim1]] || colors[0]
        }); }, style: function (pieceDatapoint) { return ({
            fill: colorHash[pieceDatapoint[dim1]] || colors[0],
            stroke: "white"
        }); }, oPadding: 5, oLabel: uniqueValues.length > 30
            ? false
            : function (columnName) { return (<text textAnchor="end" fontSize={((columnName && fontScale(columnName.length)) ||
                12) + "px"}>
              {columnName}
            </text>); }, margin: { top: 25, right: 10, bottom: 50, left: 100 }, axis: {
            orient: "bottom",
            label: rAccessor,
            tickFormat: utilities_1.numeralFormatting
        }, baseMarkProps: { forceUpdate: true }, pieceHoverAnnotation: summaryType === "violin", tooltipContent: function (hoveredDatapoint) {
            return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
          <h3>{primaryKey.map(function (pkey) { return hoveredDatapoint[pkey]; }).join(", ")}</h3>
          <p>
            {dim1}: {hoveredDatapoint[dim1]}
          </p>
          <p>
            {rAccessor}: {hoveredDatapoint[rAccessor]}
          </p>
        </tooltip_content_1["default"]>);
        } }, additionalSettings);
    return summarySettings;
};
