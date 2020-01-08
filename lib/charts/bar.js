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
var React = require("react");
var HTMLLegend_1 = require("../HTMLLegend");
var tooltip_content_1 = require("../tooltip-content");
var utilities_1 = require("../utilities");
var shared_1 = require("./shared");
exports.semioticBarChart = function (data, schema, options) {
    var selectedDimensions = options.selectedDimensions, chart = options.chart, colors = options.colors, setColor = options.setColor, barGrouping = options.barGrouping;
    var dim1 = chart.dim1, metric1 = chart.metric1, metric3 = chart.metric3, metric4 = chart.metric4;
    var oAccessor = selectedDimensions.length === 0
        ? dim1
        : function (datapoint) {
            return selectedDimensions
                .map(function (selectedDim) { return datapoint[selectedDim]; })
                .join(",");
        };
    var rAccessor = metric1;
    var additionalSettings = {};
    var colorHash = { Other: "grey" };
    var sortedData = shared_1.sortByOrdinalRange(oAccessor, (metric3 !== "none" && metric3) || rAccessor, dim1, data);
    if (metric3 && metric3 !== "none") {
        additionalSettings.dynamicColumnWidth = metric3;
    }
    var errorBarAnnotations;
    if (barGrouping === "Clustered" && metric4 && metric4 !== "none") {
        additionalSettings.rExtent = [
            Math.min.apply(Math, data.map(function (d) { return d[metric1] - d[metric4]; })),
            Math.max.apply(Math, data.map(function (d) { return d[metric1] + d[metric4]; }))
        ];
        errorBarAnnotations = function (d, i, xy) {
            var errorBarSize = Math.abs(xy.rScale(d[metric1]) - xy.rScale(d[metric1] + d[metric4]));
            return (<g>
          <rect width={xy.width} height={xy.height} style={xy.styleFn(d)}/>
          <g transform={"translate(" + xy.width / 2 + "," + (d.negative ? xy.height : 0) + ")"} stroke="#333" strokeWidth="1" opacity="0.75">
            <line y1={-errorBarSize} y2={-errorBarSize} x1={Math.min(0, -xy.width / 2 + 2)} x2={Math.max(0, xy.width / 2 - 2)}/>
            <line x1={0} x2={0} y1={-errorBarSize} y2={errorBarSize}/>
            <line y1={errorBarSize} y2={errorBarSize} x1={Math.min(0, -xy.width / 2 + 2)} x2={Math.max(0, xy.width / 2 - 2)}/>
          </g>
        </g>);
        };
    }
    var uniqueValues = sortedData.reduce(function (uniques, datapoint) {
        return !uniques.find(function (uniqueDimName) { return uniqueDimName === datapoint[dim1].toString(); })
            ? __spreadArrays(uniques, [datapoint[dim1].toString()]) : uniques;
    }, []);
    if (dim1 && dim1 !== "none") {
        uniqueValues.forEach(function (value, index) {
            // Color the first 18 values after that everything gets grey because more than 18 colors is unreadable no matter what you want
            colorHash[value] = index > 18 ? "grey" : colors[index % colors.length];
        });
        additionalSettings.afterElements = (<HTMLLegend_1["default"] valueHash={{}} values={uniqueValues} colorHash={colorHash} setColor={setColor} colors={colors}/>);
        if (barGrouping === "Clustered" ||
            (selectedDimensions.length > 0 && selectedDimensions.join(",") !== dim1)) {
            additionalSettings.pieceHoverAnnotation = true;
            var combinedOptions_1 = __spreadArrays(options.dimensions, options.metrics);
            additionalSettings.tooltipContent = function (hoveredDatapoint) {
                return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
            <div style={{ maxHeight: "300px", display: "flex", flexWrap: "wrap" }}>
              {combinedOptions_1.map(function (dim, index) { return (<div style={{
                    margin: "2px 5px 0",
                    display: "inline-block",
                    minWidth: "100px"
                }} key={"dim-" + index}>
                  <span style={{ fontWeight: 600 }}>{dim.name}</span>:{" "}
                  {hoveredDatapoint[dim.name]}
                </div>); })}
            </div>
          </tooltip_content_1["default"]>);
            };
        }
    }
    // replace with incoming cardinality when df.describe metadata is implemented
    var cardinality = (selectedDimensions.length > 0 &&
        !(selectedDimensions.length === 1 && dim1 === selectedDimensions[0]) &&
        sortedData
            .map(function (datapoint) { return datapoint[dim1]; })
            .reduce(function (uniqueDimValues, dimName) {
            return uniqueDimValues.indexOf(dimName) === -1
                ? __spreadArrays(uniqueDimValues, [dimName]) : uniqueDimValues;
        }, []).length) ||
        0;
    var barSettings = __assign({ type: barGrouping === "Clustered"
            ? { type: "clusterbar", customMark: errorBarAnnotations }
            : { type: "bar", customMark: errorBarAnnotations }, data: sortedData, oAccessor: oAccessor,
        rAccessor: rAccessor, style: function (datapoint) { return ({
            fill: colorHash[datapoint[dim1]] || colors[0],
            stroke: colorHash[datapoint[dim1]] || colors[0]
        }); }, oPadding: uniqueValues.length > 30 ? 1 : 5, oLabel: uniqueValues.length > 30
            ? false
            : function (columnLabel) {
                return <text transform="rotate(90)">{columnLabel}</text>;
            }, hoverAnnotation: true, margin: { top: 10, right: 10, bottom: 100, left: 70 }, axis: {
            orient: "left",
            label: rAccessor,
            tickFormat: utilities_1.numeralFormatting
        }, tooltipContent: function (hoveredDatapoint) {
            return (<tooltip_content_1["default"] x={hoveredDatapoint.column.xyData[0].xy.x} y={hoveredDatapoint.column.xyData[0].xy.y}>
          <p>
            {typeof oAccessor === "function"
                ? oAccessor(hoveredDatapoint.pieces[0])
                : hoveredDatapoint.pieces[0][oAccessor]}
          </p>
          <p>
            {rAccessor}:{" "}
            {hoveredDatapoint.pieces
                .map(function (piece) { return piece[rAccessor]; })
                .reduce(function (total, value) { return total + value; }, 0)}
          </p>
          {metric3 && metric3 !== "none" && (<p>
              {metric3}:{" "}
              {hoveredDatapoint.pieces
                .map(function (piece) { return piece[metric3]; })
                .reduce(function (total, value) { return total + value; }, 0)}
            </p>)}
        </tooltip_content_1["default"]>);
        }, baseMarkProps: { forceUpdate: true }, size: [500, 600] }, additionalSettings);
    return barSettings;
};
