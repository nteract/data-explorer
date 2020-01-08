"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var styled_components_1 = require("styled-components");
// A little "mixin" for picking the :before on a tooltip
var beforeContent = function (props) {
    if (props.x < 200) {
        return null;
    }
    if (props.y < 200) {
        return "\n      border-left: inherit;\n      border-top: inherit;\n      top: -8px;\n      left: calc(50% - 15px);\n      background: inherit;\n      content: \"\";\n      padding: 0px;\n      transform: rotate(45deg);\n      width: 15px;\n      height: 15px;\n      position: absolute;\n      z-index: 99;\n    ";
    }
    return "\n    border-right: inherit;\n    border-bottom: inherit;\n    bottom: -8px;\n    left: calc(50% - 15px);\n    background: inherit;\n    content: \"\";\n    padding: 0px;\n    transform: rotate(45deg);\n    width: 15px;\n    height: 15px;\n    position: absolute;\n    z-index: 99;\n  ";
};
var TooltipContent = styled_components_1["default"].div.attrs(function (props) { return ({
    style: {
        transform: "translate(\n      " + (props.x < 200 ? "0px" : "calc(-50% + 7px)") + ",\n      " + (props.y < 200 ? "10px" : "calc(-100% - 10px)") + "\n    )"
    }
}); })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: black;\n  padding: 10px;\n  z-index: 999999;\n  min-width: 120px;\n  background: white;\n  border: 1px solid #888;\n  border-radius: 5px;\n  position: relative;\n\n  & p {\n    font-size: 14px;\n  }\n\n  & h3 {\n    margin: 0 0 10px;\n  }\n\n  &:before {\n    ", "\n  }\n"], ["\n  color: black;\n  padding: 10px;\n  z-index: 999999;\n  min-width: 120px;\n  background: white;\n  border: 1px solid #888;\n  border-radius: 5px;\n  position: relative;\n\n  & p {\n    font-size: 14px;\n  }\n\n  & h3 {\n    margin: 0 0 10px;\n  }\n\n  &:before {\n    ", "\n  }\n"])), beforeContent);
exports["default"] = TooltipContent;
var templateObject_1;
