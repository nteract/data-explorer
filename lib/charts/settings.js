"use strict";
exports.__esModule = true;
var semiotic_1 = require("semiotic");
var ParallelCoordinatesController_1 = require("../ParallelCoordinatesController");
var bar_1 = require("./bar");
var hierarchical_1 = require("./hierarchical");
var line_1 = require("./line");
var network_1 = require("./network");
var summary_1 = require("./summary");
var xyplot_1 = require("./xyplot");
var semioticParallelCoordinates = function (data, schema, options) {
    return {
        data: data,
        schema: schema,
        options: options
    };
};
exports.semioticSettings = {
    line: {
        Frame: semiotic_1.ResponsiveXYFrame,
        controls: "switch between linetype",
        chartGenerator: line_1.semioticLineChart
    },
    scatter: {
        Frame: semiotic_1.ResponsiveXYFrame,
        controls: "switch between modes",
        chartGenerator: xyplot_1.semioticScatterplot
    },
    hexbin: {
        Frame: semiotic_1.ResponsiveXYFrame,
        controls: "switch between modes",
        chartGenerator: xyplot_1.semioticHexbin
    },
    bar: {
        Frame: semiotic_1.ResponsiveOrdinalFrame,
        controls: "switch between modes",
        chartGenerator: bar_1.semioticBarChart
    },
    summary: {
        Frame: semiotic_1.ResponsiveOrdinalFrame,
        controls: "switch between modes",
        chartGenerator: summary_1.semioticSummaryChart
    },
    network: {
        Frame: semiotic_1.ResponsiveNetworkFrame,
        controls: "switch between modes",
        chartGenerator: network_1.semioticNetwork
    },
    hierarchy: {
        Frame: semiotic_1.ResponsiveNetworkFrame,
        controls: "switch between modes",
        chartGenerator: hierarchical_1.semioticHierarchicalChart
    },
    parallel: {
        Frame: ParallelCoordinatesController_1["default"],
        controls: "switch between modes",
        chartGenerator: semioticParallelCoordinates
    }
};
