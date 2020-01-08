import * as React from "react";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";

import CustomReactTableStyles from "../css/";
import * as Dx from "../types";

import styled from "styled-components";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const switchMode = (currentMode: string) => {
  const nextMode: Dx.JSONObject = {
    "=": ">",
    ">": "<",
    "<": "="
  };
  return nextMode[currentMode];
};

type OnChangeProps = (input: number | string) => void;

type FilterIndexSignature = "integer" | "number" | "string";

interface NumberFilterProps {
  onChange: OnChangeProps;
  filterState: { [key: string]: string };
  filterName: string;
  updateFunction: (input: Dx.JSONObject) => void;
}

const NumberFilter = (props: NumberFilterProps) => {
  const { filterState, filterName, updateFunction, onChange } = props;
  const mode = filterState[filterName] || "=";

  return (
    <form
      style={{
        border: "1px solid gray",
        background: "white",
        borderRadius: "5px",
        width: "100%"
      }}
    >
      <input
        type="text"
        id="name"
        name="user_name"
        style={{ width: "calc(100% - 30px)", border: "none" }}
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          onChange(event.currentTarget.value);
        }}
        placeholder="number"
      />
      <button
        onClick={() => {
          updateFunction({ [filterName]: switchMode(mode) });
        }}
      >
        {mode}
      </button>
    </form>
  );
};

const stringFilter = () => ({ onChange }: { onChange: OnChangeProps }) => (
  <form>
    <input
      type="text"
      id="string-filter"
      name="string-filter"
      onChange={(event: React.FormEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
      }}
      placeholder="string"
    />
  </form>
);

const numberFilterWrapper = (
  filterState: NumberFilterProps["filterState"],
  filterName: NumberFilterProps["filterName"],
  updateFunction: NumberFilterProps["updateFunction"]
) => ({ onChange }: { onChange: OnChangeProps }) => (
  <NumberFilter
    onChange={onChange}
    filterState={filterState}
    filterName={filterName}
    updateFunction={updateFunction}
  />
);

const filterNumbers = (mode = "=") => (
  filter: FilterObject,
  row: NumberRowObject
) => {
  const filterValue = Number(filter.value);
  if (mode === "=") {
    return row[filter.id] === filterValue;
  } else if (mode === "<") {
    return row[filter.id] < filterValue;
  } else if (mode === ">") {
    return row[filter.id] > filterValue;
  }
  return row[filter.id];
};

const filterStrings = () => (filter: FilterObject, row: StringRowObject) => {
  return (
    row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
  );
};

type FilterMethodType = { [index in FilterIndexSignature]: Function };

const columnFilters: FilterMethodType = {
  integer: numberFilterWrapper,
  number: numberFilterWrapper,
  string: stringFilter
};

const filterMethod: FilterMethodType = {
  integer: filterNumbers,
  number: filterNumbers,
  string: filterStrings
};

interface FilterObject {
  id: string;
  value: string;
}

interface StringRowObject {
  [key: string]: string;
}

interface NumberRowObject {
  [key: string]: number;
}

interface State {
  filters: { [key: string]: Function };
  showFilters: boolean;
}

interface Props {
  data: { data: Dx.Datapoint[]; schema: Dx.Schema };
  height: number;
  theme?: string;
}

class DataResourceTransformGrid extends React.PureComponent<Props, State> {
  static defaultProps = {
    metadata: {},
    height: 500
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {},
      showFilters: false
    };
  }

  render() {
    const {
      data: { data, schema },
      height,
      theme
    } = this.props;

    const { filters, showFilters } = this.state;

    const { primaryKey = [] } = schema;

    const tableColumns = schema.fields.map((field: Dx.Field) => {
      if (
        field.type === "string" ||
        field.type === "number" ||
        field.type === "integer"
      ) {
        return {
          Header: field.name,
          accessor: field.name,
          fixed: primaryKey.indexOf(field.name) !== -1 && "left",
          filterMethod: (filter: Dx.JSONObject, row: Dx.JSONObject) => {
            if (
              field.type === "string" ||
              field.type === "number" ||
              field.type === "integer"
            ) {
              return filterMethod[field.type](filters[field.name])(filter, row);
            }
          },
          // If we don't have a filter defined for this field type, pass an empty div
          Filter: columnFilters[field.type](
            filters,
            field.name,
            (newFilter: { [key: string]: Function }) => {
              this.setState({ filters: { ...filters, ...newFilter } });
            }
          )
        };
      } else {
        return {
          Header: field.name,
          id: field.name,
          accessor: (rowValue:{ [key: string]: any }) => {
            return field.type === "boolean" ? rowValue[field.name].toString() : rowValue[field.name]},
          fixed: primaryKey.indexOf(field.name) !== -1 && "left"
        };
      }
    });

    return (
      <CustomReactTableStyles theme={theme}>
        <button
          //          icon="filter"
          onClick={() => this.setState({ showFilters: !showFilters })}
        >
          {showFilters ? "Hide" : "Show"} Filters
        </button>
        <ReactTableFixedColumns
          data={data}
          columns={tableColumns}
          style={{
            height: `${height}px`
          }}
          className="-striped -highlight"
          filterable={showFilters}
        />
      </CustomReactTableStyles>
    );
  }
}

export default DataResourceTransformGrid;
