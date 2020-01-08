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
var styled_components_1 = require("styled-components");
var baseButtonStyle = "\nwidth: 32px;\nheight: 32px;\ncursor: pointer;\ncolor: var(--theme-app-fg);\n";
var BaseButton = styled_components_1["default"].button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n  border: 1px solid var(--theme-app-fg);\n  background-color: var(--theme-app-bg);\n"], ["\n  ", "\n  border: 1px solid var(--theme-app-fg);\n  background-color: var(--theme-app-bg);\n"])), baseButtonStyle);
var SelectedButton = styled_components_1["default"].button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n\n  border: 1px outset #666;\n  background-color: #aaa;\n"], ["\n  ", "\n\n  border: 1px outset #666;\n  background-color: #aaa;\n"])), baseButtonStyle);
var IconButton = /** @class */ (function (_super) {
    __extends(IconButton, _super);
    function IconButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconButton.prototype.render = function () {
        var _a = this.props, message = _a.message, onClick = _a.onClick, children = _a.children, selected = _a.selected;
        var _b = this.props.title, title = _b === void 0 ? message : _b;
        var WhichButton = selected ? SelectedButton : BaseButton;
        return (<WhichButton onClick={onClick} key={message} title={title}>
        {children}
      </WhichButton>);
    };
    return IconButton;
}(React.PureComponent));
exports.IconButton = IconButton;
var templateObject_1, templateObject_2;
