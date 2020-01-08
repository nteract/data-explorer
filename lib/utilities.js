"use strict";
exports.__esModule = true;
var numeral_1 = require("numeral");
function numeralFormatting(tickValue) {
    var format = "0.[00]a";
    if (tickValue === 0) {
        return "0";
    }
    else if (tickValue > 100000000000000 || tickValue < 0.00001) {
        format = "0.[000]e+0";
    }
    else if (tickValue < 1) {
        format = "0.[0000]a";
    }
    return numeral_1["default"](tickValue).format(format);
}
exports.numeralFormatting = numeralFormatting;
function createLabelItems(uniqueValues) {
    return uniqueValues.map(function (value) { return ({ label: value }); });
}
exports.createLabelItems = createLabelItems;
