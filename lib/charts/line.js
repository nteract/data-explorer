"use strict";
exports.__esModule = true;
var d3_scale_1 = require("d3-scale");
var d3_shape_1 = require("d3-shape");
var React = require("react");
var tooltip_content_1 = require("../tooltip-content");
var utilities_1 = require("../utilities");
exports.semioticLineChart = function (data, schema, options) {
    var lineData;
    var chart = options.chart, selectedMetrics = options.selectedMetrics, lineType = options.lineType, metrics = options.metrics, primaryKey = options.primaryKey, colors = options.colors;
    // const F = (a: number, b:Dx.Chart): string[]=> selectedMetrics;
    var timeseriesSort = chart.timeseriesSort;
    var timeSeriesFields = schema.fields.find(function (field) { return field && field.name === timeseriesSort; });
    var sortType = timeseriesSort === "array-order"
        ? "integer"
        : timeSeriesFields && timeSeriesFields.type
            ? timeSeriesFields.type
            : null;
    var formatting = function (tickValue) {
        return sortType === "datetime"
            ? tickValue.toLocaleString().split(",")[0]
            : utilities_1.numeralFormatting(tickValue);
    };
    var xScale = sortType === "datetime" ? d3_scale_1.scaleTime() : d3_scale_1.scaleLinear();
    lineData = metrics
        .map(function (metric, index) {
        var metricData = timeseriesSort === "array-order"
            ? data
            : data.sort(
            // Using some questionable type assertions here
            function (datapointA, datapointB) {
                return datapointA[timeseriesSort] - datapointB[timeseriesSort];
            });
        return {
            color: colors[index % colors.length],
            label: metric.name,
            type: metric.type,
            coordinates: metricData.map(function (datapoint, datapointValue) { return ({
                value: datapoint[metric.name],
                x: timeseriesSort === "array-order"
                    ? datapointValue
                    : datapoint[timeseriesSort],
                label: metric.name,
                color: colors[index % colors.length],
                originalData: datapoint
            }); })
        };
    })
        .filter(function (metric) {
        return selectedMetrics.length === 0 ||
            selectedMetrics.some(function (selectedMetric) { return selectedMetric === metric.label; });
    });
    var canvasRender = lineData[0].coordinates.length > 250;
    return {
        lineType: { type: lineType, interpolator: d3_shape_1.curveMonotoneX },
        lines: lineData,
        xScaleType: xScale,
        canvasLines: canvasRender,
        renderKey: function (line, index) {
            return line.coordinates
                ? "line-" + line.label
                : "linepoint=" + line.label + "-" + index;
        },
        lineStyle: function (line) { return ({
            fill: lineType === "line" ? "none" : line.color,
            stroke: line.color,
            fillOpacity: 0.75
        }); },
        pointStyle: function (point) {
            return {
                fill: point.color,
                fillOpacity: 0.75
            };
        },
        axes: [
            { orient: "left", tickFormat: utilities_1.numeralFormatting },
            {
                orient: "bottom",
                ticks: 5,
                tickFormat: function (tickValue) {
                    var label = formatting(tickValue);
                    var rotation = label.length > 4 ? "45" : "0";
                    var textAnchor = label.length > 4 ? "start" : "middle";
                    return (<text transform={"rotate(" + rotation + ")"} textAnchor={textAnchor}>
              {label}
            </text>);
                }
            }
        ],
        hoverAnnotation: true,
        xAccessor: "x",
        yAccessor: "value",
        showLinePoints: !canvasRender && lineType === "line",
        margin: {
            top: 20,
            right: 200,
            bottom: sortType === "datetime" ? 80 : 40,
            left: 50
        },
        legend: {
            title: "Legend",
            position: "right",
            width: 200,
            legendGroups: [
                {
                    label: "",
                    styleFn: function (legendItem) { return ({ fill: legendItem.color }); },
                    items: lineData
                }
            ]
        },
        tooltipContent: function (hoveredDatapoint) {
            return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
          <p>
            {hoveredDatapoint.parentLine && hoveredDatapoint.parentLine.label}
          </p>
          <p>
            {(hoveredDatapoint.value &&
                hoveredDatapoint.value.toLocaleString()) ||
                hoveredDatapoint.value}
          </p>
          <p>
            {timeseriesSort}: {formatting(hoveredDatapoint.x)}
          </p>
          {primaryKey.map(function (pkey, index) { return (<p key={"key-" + index}>
              {pkey}:{" "}
              {(hoveredDatapoint.originalData[pkey].toString &&
                hoveredDatapoint.originalData[pkey].toString()) ||
                hoveredDatapoint.originalData[pkey]}
            </p>); })}
        </tooltip_content_1["default"]>);
        }
    };
};
