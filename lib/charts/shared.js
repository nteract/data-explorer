"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
function stringOrFnAccessor(datapoint, accessor) {
    return typeof accessor === "function"
        ? accessor(datapoint)
        : datapoint[accessor];
}
exports.sortByOrdinalRange = function (oAccessor, rAccessor, secondarySort, data) {
    var subsortData = {};
    var subsortArrays = [];
    data.forEach(function (datapoint) {
        var ordinalValue = stringOrFnAccessor(datapoint, oAccessor);
        if (!subsortData[ordinalValue]) {
            subsortData[ordinalValue] = { array: [], value: 0, label: ordinalValue };
            subsortArrays.push(subsortData[ordinalValue]);
        }
        subsortData[ordinalValue].array.push(datapoint);
        subsortData[ordinalValue].value += stringOrFnAccessor(datapoint, rAccessor);
    });
    subsortArrays = subsortArrays.sort(function (ordinalAData, ordinalBData) {
        if (ordinalBData.value === ordinalAData.value) {
            if (ordinalAData.label < ordinalBData.label) {
                return -1;
            }
            if (ordinalAData.label > ordinalBData.label) {
                return 1;
            }
            return 1;
        }
        return ordinalBData.value - ordinalAData.value;
    });
    if (secondarySort !== "none") {
        subsortArrays.forEach(function (ordinalData) {
            ordinalData.array = ordinalData.array.sort(function (ordinalAData, ordinalBData) {
                return stringOrFnAccessor(ordinalBData, secondarySort) -
                    stringOrFnAccessor(ordinalAData, secondarySort);
            });
        });
    }
    return subsortArrays.reduce(function (combinedArray, ordinalData) { return __spreadArrays(combinedArray, ordinalData.array); }, []);
};
