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
var d3_scale_1 = require("d3-scale");
var React = require("react");
var semiotic_1 = require("semiotic");
var HTMLLegend_1 = require("../HTMLLegend");
var tooltip_content_1 = require("../tooltip-content");
var utilities_1 = require("../utilities");
var shared_1 = require("./shared");
var styled_components_1 = require("styled-components");
var TooltipHeader = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 14px;\n  text-transform: uppercase;\n  margin: 5px;\n  font-weight: 900;\n"], ["\n  font-size: 14px;\n  text-transform: uppercase;\n  margin: 5px;\n  font-weight: 900;\n"])));
var TooltipP = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  fontsize: 12px;\n  texttransform: uppercase;\n  margin: 5px;\n"], ["\n  fontsize: 12px;\n  texttransform: uppercase;\n  margin: 5px;\n"])));
var binHash = {
    heatmap: semiotic_1.heatmapping,
    hexbin: semiotic_1.hexbinning
};
var steps = ["none", "#FBEEEC", "#f3c8c2", "#e39787", "#ce6751", "#b3331d"];
var thresholds = d3_scale_1.scaleThreshold()
    .domain([0.01, 0.2, 0.4, 0.6, 0.8])
    .range(steps);
function combineTopAnnotations(topQ, topSecondQ, dim2) {
    var combinedAnnotations = [];
    var combinedHash = {};
    __spreadArrays(topQ, topSecondQ).forEach(function (topDatapoint) {
        var hashD = combinedHash[topDatapoint[dim2]];
        if (hashD) {
            var newCoordinates = (hashD.coordinates && __spreadArrays(hashD.coordinates, [
                topDatapoint
            ])) || [topDatapoint, hashD];
            Object.keys(combinedHash[topDatapoint[dim2]]).forEach(function (key) {
                delete combinedHash[topDatapoint[dim2]][key];
            });
            combinedHash[topDatapoint[dim2]].id = topDatapoint[dim2];
            combinedHash[topDatapoint[dim2]].label = topDatapoint[dim2];
            combinedHash[topDatapoint[dim2]].type = "react-annotation";
            combinedHash[topDatapoint[dim2]].coordinates = newCoordinates;
        }
        else {
            combinedHash[topDatapoint[dim2]] = __assign({ type: "react-annotation", label: topDatapoint[dim2], id: topDatapoint[dim2], coordinates: [] }, topDatapoint);
            combinedAnnotations.push(combinedHash[topDatapoint[dim2]]);
        }
    });
    return combinedAnnotations;
}
exports.semioticHexbin = function (data, schema, options) {
    return exports.semioticScatterplot(data, schema, options, options.areaType);
};
exports.semioticScatterplot = function (data, schema, options, type) {
    if (type === void 0) { type = "scatterplot"; }
    var height = options.height - 150 || 500;
    var chart = options.chart, primaryKey = options.primaryKey, colors = options.colors, setColor = options.setColor, dimensions = options.dimensions, trendLine = options.trendLine, marginalGraphics = options.marginalGraphics;
    var dim1 = chart.dim1, dim2 = chart.dim2, dim3 = chart.dim3, metric1 = chart.metric1, metric2 = chart.metric2, metric3 = chart.metric3;
    var filteredData = data.filter(function (datapoint) {
        return datapoint[metric1] &&
            datapoint[metric2] &&
            (!metric3 || metric3 === "none" || datapoint[metric3]);
    });
    var pointTooltip = function (hoveredDatapoint) {
        return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
        <h3>{primaryKey.map(function (pkey) { return hoveredDatapoint[pkey]; }).join(", ")}</h3>
        {dimensions.map(function (dim) { return (<p key={"tooltip-dim-" + dim.name}>
            {dim.name}:{" "}
            {(hoveredDatapoint[dim.name].toString &&
            hoveredDatapoint[dim.name].toString()) ||
            hoveredDatapoint[dim.name]}
          </p>); })}
        <p>
          {metric1}: {hoveredDatapoint[metric1]}
        </p>
        <p>
          {metric2}: {hoveredDatapoint[metric2]}
        </p>
        {metric3 && metric3 !== "none" && (<p>
            {metric3}: {hoveredDatapoint[metric3]}
          </p>)}
      </tooltip_content_1["default"]>);
    };
    var areaTooltip = function (hoveredDatapoint) {
        var binItems = hoveredDatapoint.binItems || hoveredDatapoint.data || [];
        if (binItems.length === 0) {
            return null;
        }
        return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
        <TooltipHeader>
          ID, {metric1}, {metric2}
        </TooltipHeader>
        {binItems.map(function (binnedDatapoint, index) {
            var id = dimensions
                .map(function (dim) {
                return (binnedDatapoint[dim.name].toString &&
                    binnedDatapoint[dim.name].toString()) ||
                    binnedDatapoint[dim.name];
            })
                .join(",");
            return (<TooltipP key={id + index}>
                {id}, {binnedDatapoint[metric1]}, {binnedDatapoint[metric2]}
              </TooltipP>);
        })}
      </tooltip_content_1["default"]>);
    };
    var sizeScale = function () { return 5; };
    var colorHash = { Other: "grey" };
    var additionalSettings = {};
    var annotations;
    if (dim2 && dim2 !== "none") {
        var topQ_1 = __spreadArrays(filteredData).sort(function (datapointA, datapointB) { return datapointB[metric1] - datapointA[metric1]; })
            .filter(function (d, index) { return index < 3; });
        var topSecondQ = __spreadArrays(filteredData).sort(function (datapointA, datapointB) { return datapointB[metric2] - datapointA[metric2]; })
            .filter(function (datapoint) { return topQ_1.indexOf(datapoint) === -1; })
            .filter(function (d, index) { return index < 3; });
        annotations = combineTopAnnotations(topQ_1, topSecondQ, dim2);
    }
    // disabling annotations for now
    annotations = undefined;
    if (metric3 && metric3 !== "none") {
        var dataMin = Math.min.apply(Math, filteredData.map(function (datapoint) { return datapoint[metric3]; }));
        var dataMax = Math.max.apply(Math, filteredData.map(function (datapoint) { return datapoint[metric3]; }));
        sizeScale = d3_scale_1.scaleLinear()
            .domain([dataMin, dataMax])
            .range([2, 20]);
    }
    var sortedData = shared_1.sortByOrdinalRange(metric1, (metric3 !== "none" && metric3) || metric2, "none", data);
    if ((type === "scatterplot" || type === "contour") &&
        dim1 &&
        dim1 !== "none") {
        var uniqueValues = sortedData.reduce(function (uniqueArray, datapoint) {
            return (!uniqueArray.find(function (uniqueDim) { return uniqueDim === datapoint[dim1].toString(); }) && __spreadArrays(uniqueArray, [datapoint[dim1].toString()])) ||
                uniqueArray;
        }, []);
        uniqueValues.forEach(function (dimValue, index) {
            colorHash[dimValue] = index > 18 ? "grey" : colors[index % colors.length];
        });
        additionalSettings.afterElements = (<HTMLLegend_1["default"] valueHash={{}} values={uniqueValues} colorHash={colorHash} setColor={setColor} colors={colors}/>);
    }
    var areas = [];
    if (type === "heatmap" ||
        type === "hexbin" ||
        (type === "contour" && dim3 === "none")) {
        areas = [{ coordinates: filteredData }];
        if (type !== "contour") {
            var calculatedAreas_1 = binHash[type]({
                summaryType: { type: type, bins: 10 },
                data: {
                    coordinates: filteredData.map(function (datapoint) { return (__assign(__assign({}, datapoint), { x: datapoint[metric1], y: datapoint[metric2] })); })
                },
                size: [height, height]
            });
            areas = calculatedAreas_1;
            var thresholdSteps_1 = [0.2, 0.4, 0.6, 0.8, 1]
                .map(function (thresholdValue) {
                return Math.floor(calculatedAreas_1.binMax * thresholdValue);
            })
                .reduce(function (thresholdArray, thresholdValue) {
                return thresholdValue === 0 ||
                    thresholdArray.indexOf(thresholdValue) !== -1
                    ? thresholdArray
                    : __spreadArrays(thresholdArray, [thresholdValue]);
            }, []);
            var withZeroThresholdSteps_1 = __spreadArrays([0], thresholdSteps_1);
            var hexValues_1 = [];
            withZeroThresholdSteps_1.forEach(function (thresholdValue, index) {
                var nextValue = withZeroThresholdSteps_1[index + 1];
                if (nextValue) {
                    hexValues_1.push(thresholdValue + 1 + " - " + nextValue);
                }
            });
            var thresholdColors_1 = [
                "#FBEEEC",
                "#f3c8c2",
                "#e39787",
                "#ce6751",
                "#b3331d"
            ];
            var hexHash_1 = {};
            hexValues_1.forEach(function (binLabel, index) {
                hexHash_1[binLabel] = thresholdColors_1[index];
            });
            thresholds
                .domain(__spreadArrays([0.01], thresholdSteps_1))
                .range(__spreadArrays([
                "none"
            ], thresholdColors_1.filter(function (d, index) { return index < thresholdSteps_1.length; })));
            additionalSettings.afterElements = (<HTMLLegend_1["default"] valueHash={{}} values={hexValues_1} colorHash={hexHash_1} colors={colors} setColor={setColor}/>);
        }
    }
    else if (type === "contour") {
        var multiclassHash_1 = {};
        areas = [];
        filteredData.forEach(function (datapoint) {
            if (!multiclassHash_1[datapoint[dim1]]) {
                multiclassHash_1[datapoint[dim1]] = {
                    label: datapoint[dim1],
                    color: colorHash[datapoint[dim1]],
                    coordinates: []
                };
                areas.push(multiclassHash_1[datapoint[dim1]]);
            }
            multiclassHash_1[datapoint[dim1]].coordinates.push(datapoint);
        });
    }
    var renderInCanvas = (type === "scatterplot" || type === "contour") && data.length > 999;
    var marginalGraphicsAxes = [];
    if (marginalGraphics !== "none" && type === "scatterplot") {
        marginalGraphicsAxes = [
            {
                orient: "right",
                tickLineGenerator: function () { return <g />; },
                tickFormat: function () { return ""; },
                marginalSummaryType: {
                    type: marginalGraphics,
                    showPoints: !renderInCanvas
                }
            },
            {
                orient: "top",
                tickLineGenerator: function () { return <g />; },
                tickFormat: function () { return ""; },
                marginalSummaryType: {
                    type: marginalGraphics,
                    showPoints: !renderInCanvas
                }
            }
        ];
    }
    var calculatedSummaryType;
    if (type === "scatterplot" && trendLine !== "none") {
        calculatedSummaryType = { type: "trendline", regressionType: trendLine };
    }
    else if (type !== "scatterplot") {
        calculatedSummaryType = {
            type: type,
            bins: 10,
            thresholds: dim3 === "none" ? 6 : 3
        };
    }
    var xyPlotSettings = __assign({ xAccessor: type === "hexbin" || type === "heatmap" ? "x" : metric1, yAccessor: type === "hexbin" || type === "heatmap" ? "y" : metric2, axes: __spreadArrays([
            {
                orient: "left",
                ticks: 6,
                label: metric2,
                tickFormat: utilities_1.numeralFormatting,
                baseline: type === "scatterplot",
                tickSize: type === "heatmap" ? 0 : undefined
            },
            {
                orient: "bottom",
                ticks: 6,
                label: metric1,
                tickFormat: utilities_1.numeralFormatting,
                footer: type === "heatmap",
                baseline: type === "scatterplot",
                tickSize: type === "heatmap" ? 0 : undefined
            }
        ], marginalGraphicsAxes), points: (type === "scatterplot" || type === "contour") && data, canvasPoints: renderInCanvas, summaryType: calculatedSummaryType, summaryStyle: function (areaDatapoint) {
            if (type === "scatterplot") {
                return { stroke: "darkred", strokeWidth: 2, fill: "none" };
            }
            return {
                fill: type === "contour"
                    ? "none"
                    : thresholds((areaDatapoint.binItems || areaDatapoint.data).length),
                stroke: type !== "contour"
                    ? undefined
                    : dim3 === "none"
                        ? "#BBB"
                        : areaDatapoint.parentSummary.color,
                strokeWidth: type === "contour" ? 2 : 1
            };
        }, pointStyle: function (datapoint) { return ({
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
        }); }, hoverAnnotation: true, responsiveWidth: false, size: [height + 105, height + 80], margin: { left: 75, bottom: 50, right: 30, top: 30 }, annotations: (type === "scatterplot" && annotations) || undefined, annotationSettings: {
            layout: { type: "marginalia", orient: "right", marginOffset: 30 }
        }, tooltipContent: ((type === "hexbin" || type === "heatmap") && areaTooltip) ||
            pointTooltip }, additionalSettings);
    if (type !== "scatterplot") {
        xyPlotSettings.areas = areas;
    }
    return xyPlotSettings;
};
var templateObject_1, templateObject_2;
