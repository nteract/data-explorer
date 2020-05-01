import * as React from "react";

import DataResourceTransformGrid from "../charts/grid";
import { semioticSettings } from "../charts/settings";
import { colors } from "../utilities/settings";
import VizControls from "./VizControls";
import HTMLLegend from "./HTMLLegend";
import FacetControls from "./FacetControls";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";

import styled from "styled-components";
import * as Dx from "../utilities/types";
import {
    AreaType,
    Chart,
    HierarchyType,
    LineType,
    NetworkType,
    PieceType,
    SummaryType,
    View,
    SemioticSettings
} from "../utilities/types";

import { FacetController } from "semiotic"

import { extent } from "d3-array"

const mediaType: Props["mediaType"] = "application/vnd.dataresource+json";

export interface Props {
    data: Dx.DataProps;
    metadata: Dx.Metadata;
    initialView: Dx.View;
    models?: {};
    expanded?: boolean;
    theme?: string;
    height?: number;
    mediaType: "application/vnd.dataresource+json";
    onMetadataChange?: (
        { dx }: { dx: Dx.dxMetaProps },
        mediaType: Props["mediaType"]
    ) => void;
    overrideSettings?: object;
    OverrideVizControls?: React.ComponentType;
    additionalViews?: SemioticSettings;
    filterData?: Function;
    children?: React.ReactNode
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
    editable: boolean;
    showLegend: boolean;
    facetCharts?: Chart[];
    facets?: Dx.facetProps[];
    schema: Dx.Schema;
    overrideSettings?: object;
    filteredData?: Dx.Datapoint[];
    props: Props
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

const defaultResponsiveSize = [440, 300];

const MetadataWarningWrapper = styled.div`
  & {
    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
`;

const MetadataWarningContent = styled.div`
  & {
    background: #cce;
    padding: 10px;
    padding-left: 20px;
  }
`;

const MetadataWarning = ({ metadata }: { metadata: Dx.Metadata }) => {
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

const FacetWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  min-width: 0;

  .responsive-container {
    flex: 1 0 calc(50% - 10px);
    margin: 5px;
  }
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

const processInitialData = (props: Props, existingView?: View, existingDX?: Dx.dxMetaProps, filteredData?: Dx.Datapoint[]) => {

    const { metadata, initialView, overrideSettings } = props;

    // Handle case of metadata being empty yet dx not set
    const dx = existingDX || metadata.dx || { chart: {}, facets: undefined };
    const { chart = {}, facets, ...nonChartDXSettings } = dx;

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
        .map(field => ({ ...field, cardinality: 0, cardinalValues: [] })) as Dx.Dimension[];

    // Should datetime data types be transformed into js dates before getting to this resource?

    const baseData = filteredData || props.data.data

    const data = baseData.map((datapoint, datapointIndex) => {
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
        largeDataset = false
    }

    if (data.length < 50000) {
        largeDataset = false;
        const cardinalityHash: { [key: string]: { [key: string]: true } } = {};
        dimensions.forEach(dim => {
            cardinalityHash[dim.name] = {};
            data.forEach(datapoint => {
                const dimValue = datapoint[dim.name];
                cardinalityHash[dim.name][dimValue] = true;
            });

            const dimKeys = Object.keys(cardinalityHash[dim.name])

            dim.cardinality = dimKeys.length;
            dim.cardinalValues = dimKeys
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

    metrics.forEach(m => {
        m.extent = extent(data.map(d => d[m.name]))
    })

    const finalChartSettings = {
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
    };

    const displayChart: DisplayChart = {};
    let newState: State = {
        largeDataset,
        view: existingView || initialView,
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
        chart: finalChartSettings,
        overrideSettings,
        displayChart,
        primaryKey,
        data,
        editable: true,
        showLegend: true,
        facets,
        schema: props.data.schema,
        props
    }

    if (!filteredData) {
        newState = {
            ...newState,
            ...nonChartDXSettings
        }
    } else {
        newState = {
            ...newState,
            ...nonChartDXSettings,
            data
        }
    }

    return newState
}

class DataExplorer extends React.PureComponent<Partial<Props>, State> {
    static MIMETYPE: Props["mediaType"] = mediaType;

    static defaultProps = {
        metadata: {
            dx: {}
        },
        height: 500,
        mediaType,
        initialView: "grid",
        overrideSettings: {},
        additionalViews: {}
    };

    constructor(props: Props) {
        super(props);

        this.state = processInitialData(props);
    }

    componentDidMount() {
        this.updateChart(this.state);
    }

    filterData = (filterFn: Function, useBaseData?: boolean) => {

        const { data, props, view, metrics, dimensions, ...remainingState } = this.state

        if (!filterFn) {
            this.updateChart(processInitialData(props, view, remainingState))
            return
        }

        const { filteredData = data } = this.state
        let newFilteredData: Dx.Datapoint[] = []

        if (useBaseData) {
            newFilteredData = filterFn(props.data.data)
        } else {
            newFilteredData = filterFn(filteredData)
        }

        const newState = processInitialData(props, view, this.state, newFilteredData)

        this.updateChart(newState);

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
            editable,
            showLegend,
            data: stateData,
            facets,
            overrideSettings
        } = { ...this.state, ...updatedState };

        if (!this.props.data && !this.props.metadata) {
            return;
        }

        let instantiatedView

        const { data, height, OverrideVizControls, additionalViews } = this.props;

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

        const extendedSettings: SemioticSettings = { ...semioticSettings, ...additionalViews }

        if (!view || view === "grid") {
            instantiatedView = <DataResourceTransformGrid {...this.props as Props} />
        } else {
            const { Frame, chartGenerator } = extendedSettings[view];

            const chartSettings = {
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
                setColor: this.setColor,
                filterData: this.filterData,
                showLegend
            }

            const baseFrameSettings = chartGenerator(stateData, data!.schema, chartSettings);

            const { frameSettings } = baseFrameSettings

            const frameOverride = typeof overrideSettings === "function" ? overrideSettings(chartSettings, baseFrameSettings, data, view) : overrideSettings

            instantiatedView = <Frame
                responsiveWidth
                size={defaultResponsiveSize}
                {...frameSettings}
                {...frameOverride}

            />
        }

        let finalRenderedViz

        if (facets && facets.length > 0) {
            let colorHashOverride: any;
            let colorDimOverride: any;
            const facetFrames: React.ReactElement[] = [];
            facets
                .forEach((baseDXSettings, facetIndex) => {

                    const { dimFacet, initialView = view, data: facetDataSettings = this.state, metadata: facetMetadata = { dx: {} } } = baseDXSettings

                    if (initialView === "grid") {
                        const facetGridProps = { ...this.props, ...baseDXSettings }

                        facetFrames.push(<DataResourceTransformGrid {...facetGridProps as Props} />)
                    } else {
                        const { dx: facetDX = {} } = facetMetadata

                        const { FacetFrame, chartGenerator: facetChartGenerator } = extendedSettings[initialView];

                        const { data: facetData, schema: facetSchema } = facetDataSettings

                        const filteredFacetData = dimFacet ? facetData.filter(d => d[dimFacet.dim] === dimFacet.value) : facetData

                        const title = dimFacet ? `${dimFacet.dim}=${dimFacet.value}` : ""

                        const facetChartSettings = {
                            metrics,
                            dimensions,
                            chart: { ...chart, ...facetDX },
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
                            setColor: this.setColor,
                            filterData: this.filterData,
                            showLegend,
                            ...facetDX
                        }

                        const facetFrameSettings = facetChartGenerator(filteredFacetData, facetSchema, facetChartSettings, colorHashOverride, colorDimOverride)

                        const { colorHash, frameSettings, colorDim } = facetFrameSettings

                        colorHashOverride = colorHashOverride || colorHash
                        colorDimOverride = colorDimOverride || colorDim

                        const facetOverride = typeof overrideSettings === "function" ? overrideSettings(facetChartSettings, facetFrameSettings, facetDataSettings, view) : overrideSettings

                        facetFrames.push(<FacetFrame
                            {...frameSettings}
                            beforeElements={<FacetControls
                                focusFunction={(dxSettings: any) => {
                                    this.updateChart({ chart: { ...chart, ...dxSettings.dx }, view: initialView, facets: [] });
                                }}
                                removeFunction={(facetIndex: any) => { this.updateChart({ facets: facets.filter((d, i) => i !== facetIndex) }) }}
                                dxSettings={facetMetadata}
                                facetIndex={facetIndex}
                            />}
                            size={defaultResponsiveSize}
                            afterElements={null}
                            margin={{ ...frameSettings.margin, ...{ left: 55, right: 25, top: 25 } }}
                            title={title}
                            {...facetOverride}
                        />)
                    }
                })

            finalRenderedViz = <FacetWrapper>
                <FacetController>
                    {facetFrames}
                </FacetController>
                <HTMLLegend
                    valueHash={{}}
                    colorHash={colorHashOverride}
                    setColor={this.setColor}
                    colors={colors}
                />
            </FacetWrapper>
        } else {

            const controlProps = {
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
                lineType,
                areaType,
                setAreaType: this.setAreaType,
                updateChart: this.updateChart,
                updateDimensions: this.updateDimensions,
                setLineType: this.setLineType,
                updateMetrics: this.updateMetrics,
                generateFacets: this.generateFacets,
                filterData: this.filterData,
                setColor: this.setColor
            }

            const ActualVizControls = OverrideVizControls ? OverrideVizControls : VizControls

            finalRenderedViz = <React.Fragment>{instantiatedView}
                {editable && <ActualVizControls
                    {...controlProps} />}</React.Fragment>
        }

        const display: React.ReactNode = (
            <SemioticWrapper>
                {finalRenderedViz}
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
            chart,
            facets
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
                        facets,
                        ...overrideProps
                    }
                },
                mediaType
            );
        }
    };

    setGrid = () => {
        this.updateChart({ view: "grid" });
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

    generateFacets = (name: string) => (onWhat: "dimension" | "metric" | "vizType", which?: string) => {
        if (onWhat === "metric") {
            const generatedFacets = this.state.metrics.map(metric => {
                return {
                    metadata: {
                        dx: {
                            [name]: metric.name
                        }
                    }
                }
            })

            this.updateChart({ facets: generatedFacets });

        }
    };

    render() {
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
            largeDataset,
            facets
        } = this.state;

        const { additionalViews } = this.props

        let display: React.ReactNode = null;

        if (semioticSettings[view] || view === "grid" || (additionalViews && additionalViews[view])) {

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

        const toolbarProps = {
            dimensions,
            metrics,
            currentView: view,
            setGrid: this.setGrid,
            setView: this.setView,
            largeDataset
        };

        let children = React.Children.map(this.props.children, child => {
            if (!React.isValidElement(child)) {
                return;
            }
            const { componentType } = child.props as any;
            if (componentType === "viz") {
                const newProps = { children: display };
                return React.cloneElement(child, newProps);
            } else if (componentType === "toolbar") {
                return React.cloneElement(child, toolbarProps);
            }

            return child;
        });

        return (
            <div>
                <MetadataWarning metadata={this.props.metadata!} />
                <FlexWrapper>{
                    children ? children :
                        <>
                            <Viz>{display}</Viz>
                            {(!facets || facets.length === 0) && <Toolbar {...toolbarProps} />}
                        </>
                }</FlexWrapper>
            </div>
        );
    }
}

export { DataExplorer as default, DataExplorer }