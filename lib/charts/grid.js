"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var react_table_1 = require("react-table");
var react_table_hoc_fixed_columns_1 = require("react-table-hoc-fixed-columns");
var css_1 = require("../css/");
var ReactTableFixedColumns = react_table_hoc_fixed_columns_1["default"](react_table_1["default"]);
var switchMode = function (currentMode) {
    var nextMode = {
        "=": ">",
        ">": "<",
        "<": "="
    };
    return nextMode[currentMode];
};
var NumberFilter = function (props) {
    var filterState = props.filterState, filterName = props.filterName, updateFunction = props.updateFunction, onChange = props.onChange;
    var mode = filterState[filterName] || "=";
    return (<form style={{
        border: "1px solid gray",
        background: "white",
        borderRadius: "5px",
        width: "100%"
    }}>
      <input type="text" id="name" name="user_name" style={{ width: "calc(100% - 30px)", border: "none" }} onChange={function (event) {
        onChange(event.currentTarget.value);
    }} placeholder="number"/>
      <button onClick={function () {
        var _a;
        updateFunction((_a = {}, _a[filterName] = switchMode(mode), _a));
    }}>
        {mode}
      </button>
    </form>);
};
var stringFilter = function () { return function (_a) {
    var onChange = _a.onChange;
    return (<form>
    <input type="text" id="string-filter" name="string-filter" onChange={function (event) {
        onChange(event.currentTarget.value);
    }} placeholder="string"/>
  </form>);
}; };
var numberFilterWrapper = function (filterState, filterName, updateFunction) { return function (_a) {
    var onChange = _a.onChange;
    return (<NumberFilter onChange={onChange} filterState={filterState} filterName={filterName} updateFunction={updateFunction}/>);
}; };
var filterNumbers = function (mode) {
    if (mode === void 0) { mode = "="; }
    return function (filter, row) {
        var filterValue = Number(filter.value);
        if (mode === "=") {
            return row[filter.id] === filterValue;
        }
        else if (mode === "<") {
            return row[filter.id] < filterValue;
        }
        else if (mode === ">") {
            return row[filter.id] > filterValue;
        }
        return row[filter.id];
    };
};
var filterStrings = function () { return function (filter, row) {
    return (row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1);
}; };
var columnFilters = {
    integer: numberFilterWrapper,
    number: numberFilterWrapper,
    string: stringFilter
};
var filterMethod = {
    integer: filterNumbers,
    number: filterNumbers,
    string: filterStrings
};
var DataResourceTransformGrid = /** @class */ (function (_super) {
    __extends(DataResourceTransformGrid, _super);
    function DataResourceTransformGrid(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filters: {},
            showFilters: false
        };
        return _this;
    }
    DataResourceTransformGrid.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.data, data = _b.data, schema = _b.schema, height = _a.height, theme = _a.theme;
        var _c = this.state, filters = _c.filters, showFilters = _c.showFilters;
        var _d = schema.primaryKey, primaryKey = _d === void 0 ? [] : _d;
        var tableColumns = schema.fields.map(function (field) {
            if (field.type === "string" ||
                field.type === "number" ||
                field.type === "integer") {
                return {
                    Header: field.name,
                    accessor: field.name,
                    fixed: primaryKey.indexOf(field.name) !== -1 && "left",
                    filterMethod: function (filter, row) {
                        if (field.type === "string" ||
                            field.type === "number" ||
                            field.type === "integer") {
                            return filterMethod[field.type](filters[field.name])(filter, row);
                        }
                    },
                    // If we don't have a filter defined for this field type, pass an empty div
                    Filter: columnFilters[field.type](filters, field.name, function (newFilter) {
                        _this.setState({ filters: __assign(__assign({}, filters), newFilter) });
                    })
                };
            }
            else {
                return {
                    Header: field.name,
                    id: field.name,
                    accessor: function (rowValue) {
                        return field.type === "boolean" ? rowValue[field.name].toString() : rowValue[field.name];
                    },
                    fixed: primaryKey.indexOf(field.name) !== -1 && "left"
                };
            }
        });
        return (<css_1["default"] theme={theme}>
        <button 
        //          icon="filter"
        onClick={function () { return _this.setState({ showFilters: !showFilters }); }}>
          {showFilters ? "Hide" : "Show"} Filters
        </button>
        <ReactTableFixedColumns data={data} columns={tableColumns} style={{
            height: height + "px"
        }} className="-striped -highlight" filterable={showFilters}/>
      </css_1["default"]>);
    };
    DataResourceTransformGrid.defaultProps = {
        metadata: {},
        height: 500
    };
    return DataResourceTransformGrid;
}(React.PureComponent));
exports["default"] = DataResourceTransformGrid;
