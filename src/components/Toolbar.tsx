import { DatabaseOcticon } from "@nteract/octicons";
import * as React from "react";

import { chartHelpText } from "../docs/chart-docs";
import {
  BarChartIcon,
  BoxplotIcon,
  HexbinIcon,
  LineChartIcon,
  NetworkIcon,
  ParallelCoordinatesIcon,
  ScatterplotIcon,
  TreeIcon
} from "../icons";

import { View } from "../types";

import { IconButton } from "./IconButton";

import styled from "styled-components";

interface Props {
  setGrid: () => void;
  dimensions: object[];
  setView: (view: View) => void;
  currentView: string;
  // How we tell the root DataExplorer to pass toolbar props to this component:
  componentType: "toolbar";
  largeDataset?: boolean;
}

const ToolbarWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  z-index: 1;
  padding: 5px;
`;

Toolbar.defaultProps = {
  componentType: "toolbar",
  currentView: "",
  dimensions: [],
  setGrid: () => null,
  setView: () => null
};

export function Toolbar({
  dimensions,
  setGrid,
  setView,
  currentView,
  componentType,
  largeDataset
}: Props) {
  return (
    <ToolbarWrapper className="dx-button-bar">
      <IconButton
        title={chartHelpText.grid}
        onClick={setGrid}
        message={"Data Table"}
        selected={false}
      >
        <DatabaseOcticon />
      </IconButton>
      {!largeDataset && dimensions.length > 0 && (
        <IconButton
          title={chartHelpText.bar}
          onClick={() => setView("bar")}
          selected={currentView === "bar"}
          message={"Bar Graph"}
        >
          <BarChartIcon />
        </IconButton>
      )}
      <IconButton
        title={chartHelpText.summary}
        onClick={() => setView("summary")}
        selected={currentView === "summary"}
        message={"Summary"}
      >
        <BoxplotIcon />
      </IconButton>
      <IconButton
        title={chartHelpText.scatter}
        onClick={() => setView("scatter")}
        selected={currentView === "scatter"}
        message={"Scatter Plot"}
      >
        <ScatterplotIcon />
      </IconButton>
      <IconButton
        title={chartHelpText.hexbin}
        onClick={() => setView("hexbin")}
        selected={currentView === "hexbin"}
        message={"Area Plot"}
      >
        <HexbinIcon />
      </IconButton>
      {!largeDataset && dimensions.length > 1 && (
        <IconButton
          title={chartHelpText.network}
          onClick={() => setView("network")}
          selected={currentView === "network"}
          message={"Network"}
        >
          <NetworkIcon />
        </IconButton>
      )}
      {!largeDataset && dimensions.length > 0 && (
        <IconButton
          title={chartHelpText.hierarchy}
          onClick={() => setView("hierarchy")}
          selected={currentView === "hierarchy"}
          message={"Hierarchy"}
        >
          <TreeIcon />
        </IconButton>
      )}
      {dimensions.length > 0 && (
        <IconButton
          title={chartHelpText.parallel}
          onClick={() => setView("parallel")}
          selected={currentView === "parallel"}
          message={"Parallel Coordinates"}
        >
          <ParallelCoordinatesIcon />
        </IconButton>
      )}
      <IconButton
        title={chartHelpText.line}
        onClick={() => setView("line")}
        selected={currentView === "line"}
        message={"Line Graph"}
      >
        <LineChartIcon />
      </IconButton>
    </ToolbarWrapper>
  );
}
