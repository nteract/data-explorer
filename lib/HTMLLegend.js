"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var styled_components_1 = require("styled-components");
var PalettePicker_1 = require("./PalettePicker");
var CircleSpan = styled_components_1["default"].span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    margin-right: 5px;\n    border-radius: 20px;\n    margin-bottom: -5px;\n  }\n"], ["\n  & {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    margin-right: 5px;\n    border-radius: 20px;\n    margin-bottom: -5px;\n  }\n"])));
var LegendItemSpan = styled_components_1["default"].span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  & {\n    display: inline-block;\n    min-width: 80px;\n    margin: 5px;\n  }\n"], ["\n  & {\n    display: inline-block;\n    min-width: 80px;\n    margin: 5px;\n  }\n"])));
var LegendWrapper = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  & {\n    margin-top: 20px;\n  }\n"], ["\n  & {\n    margin-top: 20px;\n  }\n"])));
var HTMLLegend = function (_a) {
    var values = _a.values, colorHash = _a.colorHash, valueHash = _a.valueHash, _b = _a.colors, colors = _b === void 0 ? [] : _b, setColor = _a.setColor;
    var updateColorFn = function (newColorArray) {
        setColor(newColorArray);
    };
    return (<LegendWrapper>
      {(values.length > 18
        ? // limit the displayed values to the top 18 and bin everything else into Other
         __spreadArrays(values.filter(function (d, index) { return index < 18; }), ["Other"]) : values).map(function (value, index) {
        return colorHash[value] && (<LegendItemSpan key={"legend-item-" + index}>
              <CircleSpan style={{
            background: colorHash[value]
        }}/>
              <span className="html-legend-item">{value}</span>
              {(valueHash[value] &&
            valueHash[value] > 1 &&
            "(" + valueHash[value] + ")") ||
            ""}
            </LegendItemSpan>);
    })}
      {setColor && (<PalettePicker_1["default"] colors={colors} updateColor={updateColorFn}/>)}
    </LegendWrapper>);
};
exports["default"] = HTMLLegend;
var templateObject_1, templateObject_2, templateObject_3;
