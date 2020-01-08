"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var octicons_1 = require("@nteract/octicons");
var React = require("react");
var chart_docs_1 = require("../docs/chart-docs");
var icons_1 = require("../icons");
var IconButton_1 = require("./IconButton");
var styled_components_1 = require("styled-components");
var ToolbarWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column nowrap;\n  z-index: 1;\n  padding: 5px;\n"], ["\n  display: flex;\n  flex-flow: column nowrap;\n  z-index: 1;\n  padding: 5px;\n"])));
Toolbar.defaultProps = {
    componentType: "toolbar",
    currentView: "",
    dimensions: [],
    setGrid: function () { return null; },
    setView: function () { return null; }
};
function Toolbar(_a) {
    var dimensions = _a.dimensions, setGrid = _a.setGrid, setView = _a.setView, currentView = _a.currentView, componentType = _a.componentType, largeDataset = _a.largeDataset;
    return (<ToolbarWrapper className="dx-button-bar">
      <IconButton_1.IconButton title={chart_docs_1.chartHelpText.grid} onClick={setGrid} message={"Data Table"} selected={false}>
        <octicons_1.DatabaseOcticon />
      </IconButton_1.IconButton>
      {!largeDataset && dimensions.length > 0 && (<IconButton_1.IconButton title={chart_docs_1.chartHelpText.bar} onClick={function () { return setView("bar"); }} selected={currentView === "bar"} message={"Bar Graph"}>
          <icons_1.BarChartIcon />
        </IconButton_1.IconButton>)}
      <IconButton_1.IconButton title={chart_docs_1.chartHelpText.summary} onClick={function () { return setView("summary"); }} selected={currentView === "summary"} message={"Summary"}>
        <icons_1.BoxplotIcon />
      </IconButton_1.IconButton>
      <IconButton_1.IconButton title={chart_docs_1.chartHelpText.scatter} onClick={function () { return setView("scatter"); }} selected={currentView === "scatter"} message={"Scatter Plot"}>
        <icons_1.ScatterplotIcon />
      </IconButton_1.IconButton>
      <IconButton_1.IconButton title={chart_docs_1.chartHelpText.hexbin} onClick={function () { return setView("hexbin"); }} selected={currentView === "hexbin"} message={"Area Plot"}>
        <icons_1.HexbinIcon />
      </IconButton_1.IconButton>
      {!largeDataset && dimensions.length > 1 && (<IconButton_1.IconButton title={chart_docs_1.chartHelpText.network} onClick={function () { return setView("network"); }} selected={currentView === "network"} message={"Network"}>
          <icons_1.NetworkIcon />
        </IconButton_1.IconButton>)}
      {!largeDataset && dimensions.length > 0 && (<IconButton_1.IconButton title={chart_docs_1.chartHelpText.hierarchy} onClick={function () { return setView("hierarchy"); }} selected={currentView === "hierarchy"} message={"Hierarchy"}>
          <icons_1.TreeIcon />
        </IconButton_1.IconButton>)}
      {dimensions.length > 0 && (<IconButton_1.IconButton title={chart_docs_1.chartHelpText.parallel} onClick={function () { return setView("parallel"); }} selected={currentView === "parallel"} message={"Parallel Coordinates"}>
          <icons_1.ParallelCoordinatesIcon />
        </IconButton_1.IconButton>)}
      <IconButton_1.IconButton title={chart_docs_1.chartHelpText.line} onClick={function () { return setView("line"); }} selected={currentView === "line"} message={"Line Graph"}>
        <icons_1.LineChartIcon />
      </IconButton_1.IconButton>
    </ToolbarWrapper>);
}
exports.Toolbar = Toolbar;
var templateObject_1;
