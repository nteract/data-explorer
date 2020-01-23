import {
  ResponsiveNetworkFrame,
  ResponsiveOrdinalFrame,
  ResponsiveXYFrame
} from "semiotic";

import ParallelCoordinatesController from "../components/ParallelCoordinatesController";

import { semioticBarChart } from "./bar";
import { semioticHierarchicalChart } from "./hierarchical";
import { semioticLineChart } from "./line";
import { semioticNetwork } from "./network";
import { semioticSummaryChart } from "./summary";
import { semioticHexbin, semioticScatterplot } from "./xyplot";

import * as Dx from "../utilities/types";

const semioticParallelCoordinates = (
  data: Dx.Datapoint[],
  schema: Dx.Schema,
  options: Dx.ChartOptions
) => {
  return { frameSettings:  {
    data,
    schema,
    options
  }
};
};

export const semioticSettings: any = {
  line: {
    Frame: ResponsiveXYFrame,
    controls: "switch between linetype",
    chartGenerator: semioticLineChart
  },
  scatter: {
    Frame: ResponsiveXYFrame,
    controls: "switch between modes",
    chartGenerator: semioticScatterplot
  },
  hexbin: {
    Frame: ResponsiveXYFrame,
    controls: "switch between modes",
    chartGenerator: semioticHexbin
  },
  bar: {
    Frame: ResponsiveOrdinalFrame,
    controls: "switch between modes",
    chartGenerator: semioticBarChart
  },
  summary: {
    Frame: ResponsiveOrdinalFrame,
    controls: "switch between modes",
    chartGenerator: semioticSummaryChart
  },
  network: {
    Frame: ResponsiveNetworkFrame,
    controls: "switch between modes",
    chartGenerator: semioticNetwork
  },
  hierarchy: {
    Frame: ResponsiveNetworkFrame,
    controls: "switch between modes",
    chartGenerator: semioticHierarchicalChart
  },
  parallel: {
    Frame: ParallelCoordinatesController,
    controls: "switch between modes",
    chartGenerator: semioticParallelCoordinates
  }
};
