"use strict";
exports.__esModule = true;
var d3_scale_1 = require("d3-scale");
var React = require("react");
var tooltip_content_1 = require("../tooltip-content");
var fontScale = d3_scale_1.scaleLinear()
    .domain([5, 30])
    .range([8, 16])
    .clamp(true);
var edgeStyles = {
    force: function (colorHash) { return function (edge) { return ({
        fill: colorHash[edge.source.id],
        stroke: colorHash[edge.source.id],
        strokeOpacity: 0.25
    }); }; },
    sankey: function (colorHash) { return function (edge) { return ({
        fill: colorHash[edge.source.id],
        stroke: colorHash[edge.source.id],
        strokeOpacity: 0.25
    }); }; },
    matrix: function (colorHash) { return function (edge) { return ({
        fill: colorHash[edge.source.id],
        stroke: "none"
    }); }; },
    arc: function (colorHash) { return function (edge) { return ({
        fill: "none",
        stroke: colorHash[edge.source.id],
        strokeWidth: edge.weight || 1,
        strokeOpacity: 0.75
    }); }; }
};
var nodeStyles = {
    force: function (colorHash) { return function (node) { return ({
        fill: colorHash[node.id],
        stroke: colorHash[node.id],
        strokeOpacity: 0.5
    }); }; },
    sankey: function (colorHash) { return function (node) { return ({
        fill: colorHash[node.id],
        stroke: colorHash[node.id],
        strokeOpacity: 0.5
    }); }; },
    matrix: function (colorHash) { return function (node) { return ({
        fill: "none",
        stroke: "#666",
        strokeOpacity: 1
    }); }; },
    arc: function (colorHash) { return function (node) { return ({
        fill: colorHash[node.id],
        stroke: colorHash[node.id],
        strokeOpacity: 0.5
    }); }; }
};
var nodeLinkHover = [
    { type: "frame-hover" },
    {
        type: "highlight",
        style: { stroke: "red", strokeOpacity: 0.5, strokeWidth: 5, fill: "none" }
    }
];
var hoverAnnotationSettings = {
    force: nodeLinkHover,
    sankey: nodeLinkHover,
    matrix: [
        { type: "frame-hover" },
        { type: "highlight", style: { fill: "red", fillOpacity: 0.5 } }
    ],
    arc: nodeLinkHover
};
var nodeLabeling = {
    none: false,
    static: true,
    scaled: function (d) {
        if (!d.nodeSize || d.nodeSize < 5) {
            return null;
        }
        return (<text textAnchor="middle" y={fontScale(d.nodeSize) / 2} fontSize={fontScale(d.nodeSize) + "px"}>
        {d.id}
      </text>);
    }
};
exports.semioticNetwork = function (data, schema, options) {
    var _a = options.networkType, networkType = _a === void 0 ? "force" : _a, chart = options.chart, colors = options.colors;
    var sourceDimension = chart.dim1, targetDimension = chart.dim2, metric1 = chart.metric1, networkLabel = chart.networkLabel;
    if (!sourceDimension ||
        sourceDimension === "none" ||
        !targetDimension ||
        targetDimension === "none") {
        return {};
    }
    var edgeHash = {};
    var networkData = [];
    data.forEach(function (edge) {
        if (!edgeHash[edge[sourceDimension] + "-" + edge[targetDimension]]) {
            edgeHash[edge[sourceDimension] + "-" + edge[targetDimension]] = {
                source: edge[sourceDimension],
                target: edge[targetDimension],
                value: 0,
                weight: 0
            };
            networkData.push(edgeHash[edge[sourceDimension] + "-" + edge[targetDimension]]);
        }
        edgeHash[edge[sourceDimension] + "-" + edge[targetDimension]].value +=
            edge[metric1] || 1;
        edgeHash[edge[sourceDimension] + "-" + edge[targetDimension]].weight += 1;
    });
    var colorHash = {};
    data.forEach(function (edge) {
        if (!colorHash[edge[sourceDimension]]) {
            colorHash[edge[sourceDimension]] =
                colors[Object.keys(colorHash).length % colors.length];
        }
        if (!colorHash[edge[targetDimension]]) {
            colorHash[edge[targetDimension]] =
                colors[Object.keys(colorHash).length % colors.length];
        }
    });
    networkData.forEach(function (edge) {
        edge.weight = Math.min(10, edge.weight);
    });
    return {
        edges: networkData,
        edgeType: networkType === "force" && "halfarrow",
        edgeStyle: edgeStyles[networkType](colorHash),
        nodeStyle: nodeStyles[networkType](colorHash),
        nodeSizeAccessor: function (node) { return node.degree; },
        networkType: {
            type: networkType,
            iterations: 1000
        },
        hoverAnnotation: hoverAnnotationSettings[networkType],
        tooltipContent: function (hoveredNode) {
            return (<tooltip_content_1["default"] x={hoveredNode.x} y={hoveredNode.y}>
          <h3>{hoveredNode.id}</h3>
          <p>Links: {hoveredNode.degree}</p>
          {hoveredNode.value && <p>Value: {hoveredNode.value}</p>}
        </tooltip_content_1["default"]>);
        },
        nodeLabels: networkType === "matrix" ? false : nodeLabeling[networkLabel],
        margin: { left: 100, right: 100, top: 10, bottom: 10 }
    };
};
