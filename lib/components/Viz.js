"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var React = require("react");
var styled_components_1 = require("styled-components");
var FlexItem = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  flex: 1;\n  min-width: 0;\n"], ["\n  flex: 1;\n  min-width: 0;\n"])));
function PlaceHolder() {
    return <div>This should be a display element!</div>;
}
exports.Viz = function (_a) {
    var children = _a.children, componentType = _a.componentType;
    // In the future, the Viz component might be used for things like error boundaries
    return <FlexItem>{children}</FlexItem>;
};
exports.Viz.defaultProps = { componentType: "viz", children: <PlaceHolder /> };
exports.Viz.displayName = "Viz";
var templateObject_1;
