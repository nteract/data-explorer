"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var react_color_1 = require("react-color");
var styled_components_1 = require("styled-components");
// NOTE: These styles could be extracted for each of the components used within.
//       In order to get this typescript & styled-components transition in place though,
//       For now this just matches the prior style structure exactly with one big wrapper
//       and one extracted component -- <PaletteButton />
var Wrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & {\n    margin: 30px 0;\n    padding: 30px;\n    border: 1px solid #ccc;\n    border-radius: 5px;\n    position: relative;\n  }\n  .close {\n    position: absolute;\n    top: 15px;\n    right: 15px;\n    cursor: pointer;\n    opacity: 0.5;\n    font-size: 40px;\n    line-height: 22px;\n  }\n  .close:hover {\n    opacity: 1;\n  }\n  .grid-wrapper {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-gap: 20px;\n  }\n  h3 {\n    margin: 0 0 20px;\n  }\n  .box {\n    cursor: pointer;\n    width: 30px;\n    height: 30px;\n    border-radius: 5px;\n    display: inline-block;\n    margin: 0 20px 20px 0;\n  }\n  textarea {\n    height: 184px;\n    width: 100%;\n    box-sizing: border-box;\n    margin-bottom: 20px;\n    padding: 5px;\n    font-size: 14px;\n    border-color: #ccc;\n  }\n"], ["\n  & {\n    margin: 30px 0;\n    padding: 30px;\n    border: 1px solid #ccc;\n    border-radius: 5px;\n    position: relative;\n  }\n  .close {\n    position: absolute;\n    top: 15px;\n    right: 15px;\n    cursor: pointer;\n    opacity: 0.5;\n    font-size: 40px;\n    line-height: 22px;\n  }\n  .close:hover {\n    opacity: 1;\n  }\n  .grid-wrapper {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-gap: 20px;\n  }\n  h3 {\n    margin: 0 0 20px;\n  }\n  .box {\n    cursor: pointer;\n    width: 30px;\n    height: 30px;\n    border-radius: 5px;\n    display: inline-block;\n    margin: 0 20px 20px 0;\n  }\n  textarea {\n    height: 184px;\n    width: 100%;\n    box-sizing: border-box;\n    margin-bottom: 20px;\n    padding: 5px;\n    font-size: 14px;\n    border-color: #ccc;\n  }\n"])));
var ColorPickerWrapper = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n   {\n    width: 225px;\n  }\n"], ["\n   {\n    width: 225px;\n  }\n"])));
var PalettePickerWrapper = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n   {\n    margin-top: 30px;\n  }\n"], ["\n   {\n    margin-top: 30px;\n  }\n"])));
var PaletteButton = styled_components_1["default"].button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  & {\n    margin: 0 20px 10px 0;\n    -webkit-appearance: none;\n    padding: 5px 15px;\n    background: white;\n    border: 1px solid #bbb;\n    border-radius: 3px;\n    cursor: pointer;\n    text-transform: uppercase;\n    font-size: 14px;\n    color: #555;\n  }\n  &:hover {\n    border-color: #888;\n    color: #222;\n  }\n"], ["\n  & {\n    margin: 0 20px 10px 0;\n    -webkit-appearance: none;\n    padding: 5px 15px;\n    background: white;\n    border: 1px solid #bbb;\n    border-radius: 3px;\n    cursor: pointer;\n    text-transform: uppercase;\n    font-size: 14px;\n    color: #555;\n  }\n  &:hover {\n    border-color: #888;\n    color: #222;\n  }\n"])));
var PalettePicker = /** @class */ (function (_super) {
    __extends(PalettePicker, _super);
    function PalettePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.openClose = function () {
            _this.setState({
                open: !_this.state.open,
                colors: _this.props.colors.join(",\n")
            });
        };
        _this.handleChange = function (color, position) {
            _this.setState({ selectedColor: color, selectedPosition: position });
        };
        _this.pickerChange = function (color) {
            var colors = _this.props.colors;
            colors[_this.state.selectedPosition] = color.hex;
            _this.props.updateColor(colors);
            _this.setState({ selectedColor: color.hex, colors: colors.join(",\n") });
        };
        _this.colorsFromTextarea = function () {
            var parsedTextValue = _this.state.colors
                .replace(/\"/g, "")
                .replace(/ /g, "")
                .replace(/\[/g, "")
                .replace(/\]/g, "")
                .replace(/\r?\n|\r/g, "")
                .split(",");
            _this.props.updateColor(parsedTextValue);
        };
        _this.updateTextArea = function (e) {
            _this.setState({ colors: e.target.value });
        };
        _this.state = {
            open: false,
            selectedColor: props.colors[0],
            selectedPosition: 0,
            colors: props.colors.join(",\n")
        };
        return _this;
    }
    PalettePicker.prototype.render = function () {
        var _this = this;
        if (!this.state.open) {
            return (<div style={{ display: "inline-block" }}>
          <PaletteButton onClick={this.openClose}>Adjust Palette</PaletteButton>
        </div>);
        }
        var colors = this.props.colors;
        return (<Wrapper>
        <div className="close" role="button" tabIndex={0} onClick={this.openClose} onKeyPress={function (e) {
            if (e.keyCode === 13) {
                _this.openClose();
            }
        }}>
          ×
        </div>
        <div className="grid-wrapper">
          <div>
            <h3>Select Color</h3>
            {colors.map(function (color, index) { return (<div key={"color-" + index} className="box" style={{ background: color }} role="button" tabIndex={0} onKeyPress={function (e) {
            if (e.keyCode === 13) {
                _this.handleChange(color, index);
            }
        }} onClick={function () { return _this.handleChange(color, index); }}/>); })}
          </div>
          <div>
            <h3>Adjust Color</h3>
            <ColorPickerWrapper>
              <react_color_1.ChromePicker color={this.state.selectedColor} onChangeComplete={this.pickerChange}/>
            </ColorPickerWrapper>
          </div>
          <div>
            <h3>Paste New Colors</h3>
            <textarea value={this.state.colors} onChange={this.updateTextArea}/>
            <PaletteButton onClick={this.colorsFromTextarea}>
              Update Colors
            </PaletteButton>
          </div>
        </div>
        <PalettePickerWrapper>
          <a href={"http://projects.susielu.com/viz-palette?colors=[" + colors
            .map(function (d) { return "\"" + d + "\""; })
            .join(",") + "]&backgroundColor=\"white\"&fontColor=\"black\""}>
            Evaluate This Palette with VIZ PALETTE
          </a>
        </PalettePickerWrapper>
      </Wrapper>);
    };
    PalettePicker.defaultProps = {
        metadata: {},
        height: 500
    };
    return PalettePicker;
}(React.PureComponent));
exports["default"] = PalettePicker;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
