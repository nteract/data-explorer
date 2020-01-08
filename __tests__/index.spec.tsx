import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { getDxProps } from "../__mocks__/dx-props";
import DataExplorerDefault, {
  DataExplorer,
  Props,
  Toolbar,
  Viz
} from "../src/index";
import * as Dx from "../src/types";

describe("Default DataExplorer export", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  test("with metadata", () => {
    const wrapper = shallow(<DataExplorerDefault {...dataExplorerProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("without metadata", () => {
    delete dataExplorerProps.metadata;
    const wrapper = shallow(<DataExplorerDefault {...dataExplorerProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("renders a Viz and a Toolbar", () => {
    const wrapper = shallow(<DataExplorerDefault {...dataExplorerProps} />);

    expect(wrapper.find(Toolbar).exists()).toEqual(true);
    expect(wrapper.find(Viz).exists()).toEqual(true);
  });
});

describe("DataExplorer composed", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  test("with Toolbar to the left", () => {
    const wrapper = shallow(
      <DataExplorer
        data={dataExplorerProps.data}
        metadata={dataExplorerProps.metadata}
      >
        <Toolbar />
        <Viz />
      </DataExplorer>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test("with Toolbar to the right", () => {
    dataExplorerProps.metadata.dx.view = "bar";
    const wrapper = shallow(
      <DataExplorer
        data={dataExplorerProps.data}
        metadata={dataExplorerProps.metadata}
      >
        <Viz />
        <Toolbar />
      </DataExplorer>
    );
    expect(wrapper.find(Toolbar).props()).toEqual(
      expect.objectContaining({ currentView: "bar" })
    );
  });

  test("With no Toolbar, still renders Viz", () => {
    const wrapper = shallow(
      <DataExplorer
        data={dataExplorerProps.data}
        metadata={dataExplorerProps.metadata}
      >
        {false ? <Toolbar /> : null}
        <Viz />
      </DataExplorer>
    );
    expect(wrapper.find(Viz).exists()).toEqual(true);
  });

  test("Default primaryKey if none provided", () => {
    delete dataExplorerProps.data.schema.primaryKey;
    const wrapper = shallow(
      <DataExplorer
        data={dataExplorerProps.data}
        metadata={dataExplorerProps.metadata}
      >
        <Toolbar />
        <Viz />
      </DataExplorer>
    );

    expect(wrapper.state("primaryKey")).toEqual([Dx.defaultPrimaryKey]);
    // The range index should be equivalent to the array index, [0,1,2,...n]
    const data = wrapper.state("data");
    expect(data).toHaveLength(9);
    expect(
      (data as any[]).filter(
        (datapoint, index) => datapoint[Dx.defaultPrimaryKey] !== index
      )
    ).toEqual([]);
  });
});
