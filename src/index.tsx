import * as React from "react";

import DataResourceTransformGrid from "./charts/grid";
import { semioticSettings } from "./charts/settings";
import { Toolbar } from "./components/Toolbar";
import { Viz } from "./components/Viz";
import { colors } from "./settings";
import VizControls from "./VizControls";

export { DataExplorer, Toolbar, Viz };

const mediaType: Props["mediaType"] = "application/vnd.dataresource+json";

import styled from "styled-components";
import * as Dx from "./types";
import {
  AreaType,
  Chart,
  HierarchyType,
  LineType,
  NetworkType,
  PieceType,
  SummaryType,
  View
} from "./types";

interface dxMetaProps {
  view?: View;
  lineType?: LineType;
  areaType?: AreaType;
  selectedDimensions?: string[];
  selectedMetrics?: string[];
  pieceType?: PieceType;
  summaryType?: SummaryType;
  networkType?: NetworkType;
  hierarchyType?: HierarchyType;
  trendLine?: Dx.TrendLineType;
  marginalGraphics?: SummaryType;
  barGrouping?: Dx.BarGroupingType;
  colors?: string[];
  chart?: Chart;
}

interface Metadata {
  dx: dxMetaProps;
  sampled?: boolean;
}

export interface Props {
  data: Dx.DataProps;
  metadata: Metadata;
  theme?: string;
  expanded?: boolean;
  height?: number;
  models?: {};
  mediaType: "application/vnd.dataresource+json";
  initialView: View;
  onMetadataChange?: (
    { dx }: { dx: dxMetaProps },
    mediaType: Props["mediaType"]
  ) => void;
}

interface State {
  largeDataset: boolean;
  view: View;
  colors: string[];
  metrics: Dx.Field[];
  dimensions: Dx.Dimension[];
  selectedMetrics: string[];
  selectedDimensions: string[];
  networkType: NetworkType;
  hierarchyType: HierarchyType;
  pieceType: PieceType;
  summaryType: SummaryType;
  lineType: LineType;
  areaType: AreaType;
  chart: Chart;
  displayChart: DisplayChart;
  primaryKey: string[];
  data: Dx.Datapoint[];
  trendLine: Dx.TrendLineType;
  marginalGraphics: Dx.SummaryType;
  barGrouping: Dx.BarGroupingType;
}

const generateChartKey = ({
  view,
  lineType,
  areaType,
  selectedDimensions,
  selectedMetrics,
  pieceType,
  summaryType,
  networkType,
  hierarchyType,
  trendLine,
  marginalGraphics,
  barGrouping,
  chart
}: {
  view: View;
  lineType: LineType;
  areaType: AreaType;
  selectedDimensions: string[];
  selectedMetrics: string[];
  pieceType: PieceType;
  summaryType: SummaryType;
  networkType: NetworkType;
  hierarchyType: HierarchyType;
  trendLine: Dx.TrendLineType;
  marginalGraphics: SummaryType;
  barGrouping: Dx.BarGroupingType;
  chart: Chart;
}) =>
  `${view}-${lineType}-${areaType}-${selectedDimensions.join(
    ","
  )}-${selectedMetrics.join(
    ","
  )}-${pieceType}-${summaryType}-${networkType}-${hierarchyType}-${trendLine}-${marginalGraphics}-${barGrouping}-${JSON.stringify(
    chart
  )}`;

interface DisplayChart {
  [chartKey: string]: React.ReactNode;
}
/*
  contour is an option for scatterplot
  pie is a transform on bar
*/

const defaultResponsiveSize = [500, 300];

const MetadataWarningWrapper = styled.div`
  & {
    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
`;

const MetadataWarningContent = styled.div`
  & {
    backgroundcolor: #cce;
    padding: 10px;
    paddingleft: 20px;
  }
`;

const MetadataWarning = ({ metadata }: { metadata: Metadata }) => {
  const warning =
    metadata && metadata.sampled ? (
      <span>
        <b>NOTE:</b> This data is sampled
      </span>
    ) : null;

  return (
    <MetadataWarningWrapper>
      {warning ? (
        <MetadataWarningContent>{warning}</MetadataWarningContent>
      ) : null}
    </MetadataWarningWrapper>
  );
};

const FlexWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const SemioticWrapper = styled.div`
  width: 100%;
  .html-legend-item {
    color: var(--theme-app-fg);
  }

  .tick > path {
    stroke: lightgray;
  }

  .axis-labels,
  .ordinal-labels {
    fill: var(--theme-app-fg);
    font-size: 14px;
  }

  path.connector,
  path.connector-end {
    stroke: var(--theme-app-fg);
  }

  path.connector-end {
    fill: var(--theme-app-fg);
  }

  text.annotation-note-label,
  text.legend-title,
  .legend-item text {
    fill: var(--theme-app-fg);
    stroke: none;
  }

  .xyframe-area > path {
    stroke: var(--theme-app-fg);
  }

  .axis-baseline {
    stroke-opacity: 0.25;
    stroke: var(--theme-app-fg);
  }
  circle.frame-hover {
    fill: none;
    stroke: gray;
  }
  .rect {
    stroke: green;
    stroke-width: 5px;
    stroke-opacity: 0.5;
  }
  rect.selection {
    opacity: 0.5;
  }
`;

class DataExplorer extends React.PureComponent<Partial<Props>, State> {
  static MIMETYPE: Props["mediaType"] = mediaType;

  static defaultProps = {
    metadata: {
      dx: {}
    },
    height: 500,
    mediaType,
    initialView: "grid"
  };

  constructor(props: Props) {
    super(props);

    const { metadata, initialView } = props;

    // Handle case of metadata being empty yet dx not set
    const dx = metadata.dx || {};
    const chart = dx.chart || {};

    let { fields = [], primaryKey = [] } = props.data.schema;
    // Provide a default primaryKey if none provided
    if (primaryKey.length === 0) {
      primaryKey = [Dx.defaultPrimaryKey];
      fields = [...fields, { name: Dx.defaultPrimaryKey, type: "integer" }];
    }

    const dimensions = fields
      .filter(
        field =>
          field.type === "string" ||
          field.type === "boolean" ||
          field.type === "datetime"
      )
      .map(field => ({ ...field, cardinality: 0 })) as Dx.Dimension[];

    // Should datetime data types be transformed into js dates before getting to this resource?
    const data = props.data.data.map((datapoint, datapointIndex) => {
      const mappedDatapoint: Dx.Datapoint = {
        ...datapoint
      };
      fields.forEach(field => {
        if (field.name === Dx.defaultPrimaryKey) {
          mappedDatapoint[Dx.defaultPrimaryKey] = datapointIndex;
        }
        if (field.type === "datetime") {
          mappedDatapoint[field.name] = new Date(mappedDatapoint[field.name]);
        }
      });
      return mappedDatapoint;
    });

    let largeDataset = true;
    let selectedDimensions: string[] = [];

    if (data.length < 5000) {
      largeDataset = false;
      const cardinalityHash: { [key: string]: { [key: string]: true } } = {};
      dimensions.forEach(dim => {
        cardinalityHash[dim.name] = {};
        data.forEach(datapoint => {
          const dimValue = datapoint[dim.name];
          cardinalityHash[dim.name][dimValue] = true;
        });

        dim.cardinality = Object.entries(cardinalityHash[dim.name]).length;
      });

      selectedDimensions = dimensions
        .sort((a, b) => a.cardinality - b.cardinality)
        .filter((data, index) => index === 0)
        .map(dim => dim.name);
    }

    const metrics = fields
      .filter(
        field =>
          field.type === "integer" ||
          field.type === "number" ||
          field.type === "datetime"
      )
      .filter(
        field => !primaryKey.find(pkey => pkey === field.name)
      ) as Dx.Metric[];

    const displayChart: DisplayChart = {};
    this.state = {
      largeDataset,
      view: initialView,
      lineType: "line",
      areaType: "hexbin",
      trendLine: "none",
      marginalGraphics: "none",
      barGrouping: "Clustered",
      selectedDimensions,
      selectedMetrics: [],
      pieceType: "bar",
      summaryType: "violin",
      networkType: "force",
      hierarchyType: "dendrogram",
      dimensions,
      metrics,
      colors,
      // ui: {},
      chart: {
        metric1: (metrics[0] && metrics[0].name) || "none",
        metric2: (metrics[1] && metrics[1].name) || "none",
        metric3: "none",
        metric4: "none",
        dim1: (dimensions[0] && dimensions[0].name) || "none",
        dim2: (dimensions[1] && dimensions[1].name) || "none",
        dim3: "none",
        timeseriesSort: "array-order",
        networkLabel: "none",
        ...chart
      },
      displayChart,
      primaryKey,
      data,
      ...dx
    };
  }

  componentDidMount() {
    // This is necessary to render any charts based on passed metadata because the grid doesn't result from the updateChart function but any other view does
    if (this.state.view !== "grid") {
      this.updateChart(this.state);
    }
  }

  updateChart = (updatedState: Partial<State>) => {
    const {
      view,
      dimensions,
      metrics,
      chart,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      trendLine,
      marginalGraphics,
      barGrouping,
      colors,
      primaryKey,
      data: stateData
    } = { ...this.state, ...updatedState };

    if (!this.props.data && !this.props.metadata && !this.props.initialView) {
      return;
    }

    const { data, height } = this.props;

    const { Frame, chartGenerator } = semioticSettings[view];

    const chartKey = generateChartKey({
      view,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      chart,
      trendLine,
      marginalGraphics,
      barGrouping
    });

    const frameSettings = chartGenerator(stateData, data!.schema, {
      metrics,
      dimensions,
      chart,
      colors,
      height,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      primaryKey,
      trendLine,
      marginalGraphics,
      barGrouping,
      setColor: this.setColor
    });

    const display: React.ReactNode = (
      <SemioticWrapper>
        <Frame
          responsiveWidth
          size={defaultResponsiveSize}
          {...frameSettings}
        />
        <VizControls
          {...{
            data: stateData,
            view,
            chart,
            metrics,
            dimensions,
            selectedDimensions,
            selectedMetrics,
            hierarchyType,
            summaryType,
            networkType,
            trendLine,
            marginalGraphics,
            barGrouping,
            updateChart: this.updateChart,
            updateDimensions: this.updateDimensions,
            setLineType: this.setLineType,
            updateMetrics: this.updateMetrics,
            lineType,
            setAreaType: this.setAreaType,
            areaType
          }}
        />
      </SemioticWrapper>
    );

    // If you pass an onMetadataChange function, then fire it and pass the updated dx settings so someone upstream can update the metadata or otherwise use it

    this.updateMetadata({
      view,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      trendLine,
      marginalGraphics,
      barGrouping,
      colors,
      chart
    });

    this.setState(
      (prevState): any => {
        return {
          ...updatedState,
          displayChart: {
            ...prevState.displayChart,
            [chartKey]: display
          }
        };
      }
    );
  };
  setView = (view: View) => {
    this.updateChart({ view });
  };

  updateMetadata = (overrideProps: object) => {
    const { onMetadataChange, metadata } = this.props;
    const {
      view,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      trendLine,
      marginalGraphics,
      barGrouping,
      colors,
      chart
    } = this.state;
    if (onMetadataChange) {
      onMetadataChange(
        {
          ...metadata,
          dx: {
            view,
            lineType,
            areaType,
            selectedDimensions,
            selectedMetrics,
            pieceType,
            summaryType,
            networkType,
            hierarchyType,
            trendLine,
            marginalGraphics,
            barGrouping,
            colors,
            chart,
            ...overrideProps
          }
        },
        mediaType
      );
    }
  };

  setGrid = () => {
    this.updateMetadata({ view: "grid" });
    this.setState({ view: "grid" });
  };

  setColor = (newColorArray: string[]) => {
    this.updateChart({ colors: newColorArray });
  };

  setLineType = (selectedLineType: LineType) => {
    this.updateChart({ lineType: selectedLineType });
  };

  setAreaType = (selectedAreaType: AreaType) => {
    this.updateChart({ areaType: selectedAreaType });
  };

  updateDimensions = (selectedDimension: string) => {
    const oldDims = this.state.selectedDimensions;
    const newDimensions =
      oldDims.indexOf(selectedDimension) === -1
        ? [...oldDims, selectedDimension]
        : oldDims.filter(dimension => dimension !== selectedDimension);
    this.updateChart({ selectedDimensions: newDimensions });
  };
  updateMetrics = (selectedMetric: string) => {
    const oldMetrics = this.state.selectedMetrics;
    const newMetrics =
      oldMetrics.indexOf(selectedMetric) === -1
        ? [...oldMetrics, selectedMetric]
        : oldMetrics.filter(metric => metric !== selectedMetric);
    this.updateChart({ selectedMetrics: newMetrics });
  };

  render() {
    const {
      view,
      dimensions,
      chart,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      trendLine,
      marginalGraphics,
      barGrouping,
      largeDataset
    } = this.state;

    let display: React.ReactNode = null;

    if (view === "grid") {
      display = <DataResourceTransformGrid {...this.props as Props} />;
    } else if (
      [
        "line",
        "scatter",
        "bar",
        "network",
        "summary",
        "hierarchy",
        "hexbin",
        "parallel"
      ].includes(view)
    ) {
      const chartKey = generateChartKey({
        view,
        lineType,
        areaType,
        selectedDimensions,
        selectedMetrics,
        pieceType,
        summaryType,
        networkType,
        hierarchyType,
        chart,
        trendLine,
        marginalGraphics,
        barGrouping
      });

      display = this.state.displayChart[chartKey];
    }
    const children = React.Children.map(this.props.children, child => {
      if (!React.isValidElement(child)) {
        return;
      }
      const { componentType } = child.props as any;
      if (componentType === "viz") {
        const newProps = { children: display };
        return React.cloneElement(child, newProps);
      } else if (componentType === "toolbar") {
        const toolbarProps = {
          dimensions,
          currentView: view,
          setGrid: this.setGrid,
          setView: this.setView,
          largeDataset
        };
        return React.cloneElement(child, toolbarProps);
      }

      return child;
    });

    return (
      <div>
        <MetadataWarning metadata={this.props.metadata!} />
        <FlexWrapper>{children}</FlexWrapper>
      </div>
    );
  }
}

const DataExplorerDefault: React.FunctionComponent<Props> & {
  MIMETYPE: Props["mediaType"];
} = (props: Partial<Props>) => {
  return (
    <DataExplorer {...props}>
      <Viz />
      <Toolbar />
    </DataExplorer>
  );
};

DataExplorerDefault.defaultProps = {
  mediaType
};
DataExplorerDefault.displayName = "DataExplorerDefault";

// For the jupyter extension to load MIMETYPE must be present.
DataExplorerDefault.MIMETYPE = mediaType;

export default DataExplorerDefault;
