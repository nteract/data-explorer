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
var d3_collection_1 = require("d3-collection");
var d3_interpolate_1 = require("d3-interpolate");
var React = require("react");
var tooltip_content_1 = require("../tooltip-content");
var parentPath = function (datapoint, pathArray) {
    if (datapoint.parent) {
        pathArray = parentPath(datapoint.parent, __spreadArrays([datapoint.key], pathArray));
    }
    else {
        pathArray = __spreadArrays(["root"], pathArray);
    }
    return pathArray;
};
var hierarchicalTooltip = function (datapoint, primaryKey, metric) {
    var pathString = datapoint.parent
        ? parentPath(datapoint.parent, (datapoint.key && [datapoint.key]) || []).join("->")
        : "";
    var content = [];
    if (!datapoint.parent) {
        content.push(<h2 key="hierarchy-title">Root</h2>);
    }
    else if (datapoint.key) {
        content.push(<h2 key="hierarchy-title">{datapoint.key}</h2>);
        content.push(<p key="path-string">{pathString}</p>);
        content.push(<p key="hierarchy-value">Total Value: {datapoint.value}</p>);
        content.push(<p key="hierarchy-children">Children: {datapoint.children.length}</p>);
    }
    else {
        content.push(<p key="leaf-label">
        {pathString}
        ->
        {primaryKey.map(function (pkey) { return datapoint[pkey]; }).join(", ")}
      </p>);
        content.push(<p key="hierarchy-value">
        {metric}: {datapoint[metric]}
      </p>);
    }
    return content;
};
var hierarchicalColor = function (colorHash, datapoint) {
    if (datapoint.depth === 0) {
        return "white";
    }
    if (datapoint.depth === 1) {
        return colorHash[datapoint.key];
    }
    var colorNode = datapoint;
    for (var x = datapoint.depth; x > 1; x--) {
        colorNode = colorNode.parent;
    }
    var lightenScale = d3_interpolate_1.interpolateLab("white", colorHash[colorNode.key]);
    return lightenScale(Math.max(0, datapoint.depth / 6));
};
exports.semioticHierarchicalChart = function (data, schema, options) {
    var _a = options.hierarchyType, baseHierarchyType = _a === void 0 ? "dendrogram" : _a, chart = options.chart, selectedDimensions = options.selectedDimensions, primaryKey = options.primaryKey, colors = options.colors;
    var metric1 = chart.metric1;
    // a sunburst is just a radial partition
    var hierarchyType = baseHierarchyType === "sunburst" ? "partition" : baseHierarchyType;
    if (selectedDimensions.length === 0) {
        return {};
    }
    var nestingParams = d3_collection_1.nest();
    selectedDimensions.forEach(function (dim) {
        nestingParams.key(function (param) { return param[dim]; });
    });
    var colorHash = {};
    var sanitizedData = [];
    data.forEach(function (datapoint) {
        if (!colorHash[datapoint[selectedDimensions[0]]]) {
            colorHash[datapoint[selectedDimensions[0]]] =
                colors[Object.keys(colorHash).length];
        }
        sanitizedData.push(__assign(__assign({}, datapoint), { sanitizedR: datapoint.r, r: undefined }));
    });
    var entries = nestingParams.entries(sanitizedData);
    var rootNode = { values: entries };
    return {
        edges: rootNode,
        edgeStyle: function () { return ({ fill: "lightgray", stroke: "gray" }); },
        nodeStyle: function (node) {
            return {
                fill: hierarchicalColor(colorHash, node),
                stroke: node.depth === 1 ? "white" : "black",
                strokeOpacity: node.depth * 0.1 + 0.2
            };
        },
        networkType: {
            type: hierarchyType,
            projection: baseHierarchyType === "sunburst" && "radial",
            hierarchySum: function (node) { return node[metric1]; },
            hierarchyChildren: function (node) { return node.values; },
            padding: hierarchyType === "treemap" ? 3 : 0
        },
        edgeRenderKey: function (edge, index) {
            return index;
        },
        baseMarkProps: { forceUpdate: true },
        margin: { left: 100, right: 100, top: 10, bottom: 10 },
        hoverAnnotation: [
            { type: "frame-hover" },
            {
                type: "highlight",
                style: {
                    stroke: "red",
                    strokeOpacity: 0.5,
                    strokeWidth: 5,
                    fill: "none"
                }
            }
        ],
        tooltipContent: function (hoveredDatapoint) {
            return (<tooltip_content_1["default"] x={hoveredDatapoint.x} y={hoveredDatapoint.y}>
          {hierarchicalTooltip(hoveredDatapoint, primaryKey, metric1)}
        </tooltip_content_1["default"]>);
        }
    };
};
