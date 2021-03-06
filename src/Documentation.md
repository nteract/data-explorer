### Using the DataExplorer

The simplest way to use the DataExplorer component is in its default configuration with controls and viz integrated. The only prop requirement is a dataset.

```jsx
import DataExplorer from "@nteract/data-explorer";

<DataExplorer data={largeVizData} />;
```

The `data` prop expects a well-formatted data object:

```ts
type Data = {
      schema: { fields: [{ name: string, type: string }...], primaryKey: Array<?string> },
      data: [{ key: value },...]
    }
```

Below is an example of a data explorer with a valid data object.
Notice, though, that network visualization is not available, that's because that button is disabled if your data (like this data) only has one dimension (because network data requires some way of defining source & target).

By default the initial view is a grid. Click on the chart icons on the right to see different views.

```jsx static
import DataExplorer from "@nteract/data-explorer";

const basicData = {
  schema: {
    fields: [
      {
        name: "valueA",
        type: "integer",
      },
      {
        name: "valueB",
        type: "integer",
      },
      {
        name: "valueC",
        type: "integer",
      },
      {
        name: "label",
        type: "string",
      },
    ],
    primaryKey: [],
  },
  data: [
    { valueA: 3, valueB: 5, valueC: 1, label: "first" },
    { valueA: 10, valueB: 1, valueC: 12, label: "second" },
    { valueA: -5, valueB: 8, valueC: 6, label: "third" },
  ],
};

<DataExplorer data={basicData} />;
```

### With Defaults

You can send chart settings by passing a metadata object to the metadata properties. Data Explorer chart settings are kept in the `dx.chart` property of metadata.
Chart settings refer to the metrics, dimensions and sort order for time series data (line charts). If you want to change higher level settings (such as the summaryType from the default violin plot to a boxplot) adjust those settings in the dx properties as below.

```jsx
import DataExplorer from "@nteract/data-explorer";

<DataExplorer
  overrideSettings={{
    backgroundGraphics: (
      <text fontSize="24px" fontWeight={900} fill="#DDD" y={20}>
        DX™
      </text>
    ),
  }}
  data={largeVizData}
  initialView="summary"
  metadata={{
    dx: {
      summaryType: "boxplot",
      colors: [
        "rgb(50,150,77)",
        "rgb(174,210,132)",
        "rgb(11,82,46)",
        "rgb(116,238,101)",
        "rgb(62,142,157)",
        "rgb(145,206,244)",
        "rgb(28,75,180)",
        "rgb(82,233,230)",
      ],
      chart: {
        metric1: "Happiness Score",
      },
    },
  }}
/>;
```

### Customization

#### Toolbar Position

This component is a wrapper that can hold multiple (or no) Viz and Toolbar components. Here it is with `Toolbar` & `Viz` components. This allows you to compose it, for instance putting a `Toolbar` on the left and the right.

```jsx
import DataExplorer, { Viz, Toolbar } from "@nteract/data-explorer";

<DataExplorer data={largeVizData}>
  <Toolbar />
  <Viz />
  <Toolbar />
</DataExplorer>;
```

### No Toolbar

If you want your Data Explorer to be set to a particular view and not be able to be switched, you can leave out the toolbar.

```jsx
import DataExplorer, { Viz, Toolbar } from "@nteract/data-explorer";

<DataExplorer
  data={largeVizData}
  initialView="hierarchy"
  metadata={{
    dx: {
      hierarchyType: "treemap",
      metric1: "Economy (GDP per Capita)",
    },
  }}
>
  <Viz />
</DataExplorer>;
```

### Faceting

You can turn on faceting by sending multiple DataExplorer prop objects to the DataExplorer's `facets` property. When you do so, the properties of each object sent to faceting will be extended onto the properties sent to the data explorer, resulting in multiple views (one for each object sent to `facets`).

```jsx
import DataExplorer, { Viz, Toolbar } from "@nteract/data-explorer";

<DataExplorer
  data={{ ...largeVizData }}
  metadata={{
    dx: {
      facets: [
        {
          initialView: "bar",
          metadata: {
            dx: {
              metric1: "Generosity",
            },
          },
        },
        {
          initialView: "bar",
          //      dimFacet: { dim: "Region", value: "Western Europe" },
          metadata: {
            dx: {
              metric1: "Dystopia Residual",
            },
          },
        },
        {
          initialView: "bar",
          metadata: {
            dx: {
              metric1: "Happiness Score",
            },
          },
        },
        {
          initialView: "bar",
          metadata: {
            dx: {
              metric1: "Economy (GDP per Capita)",
            },
          },
        },
        {
          initialView: "bar",
          metadata: {
            dx: {
              metric1: "Trust (Government Corruption)",
            },
          },
        },
        {
          initialView: "bar",
          metadata: {
            dx: {
              metric1: "Health (Life Expectancy)",
            },
          },
        },
      ],
    },
  }}
  initialView="summary"
>
  <Viz />
</DataExplorer>;
```

### Custom Controls

If you pass `OverrideVizControls` to `DataExplorer` you can create your own custom controls for changing metrics. This can allow you to be more deliberate with your controls rather than using the default controls, which are designed for more flexibility. You might want to only expose specific functionality, for instance only allowing a user to add specific features to the chart or look at specific metrics, as below.

```jsx
const SampleControls = (props) => {
  const {
    data,
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
    updateChart,
    updateDimensions,
    setLineType,
    updateMetrics,
    generateFacets,
    lineType,
    setAreaType,
    areaType,
  } = props;

  return (
    <div>
      <button onClick={() => updateChart({ marginalGraphics: "histogram" })}>
        Add Marginal Histogram
      </button>
      <button
        onClick={() =>
          updateChart({ chart: { ...chart, metric3: "Generosity" } })
        }
      >
        Show Generosity
      </button>
    </div>
  );
};

import DataExplorer, { Viz, Toolbar } from "@nteract/data-explorer";

<DataExplorer
  data={{ ...largeVizData }}
  OverrideVizControls={SampleControls}
  overrideSettings={{ size: [400, 400], margin: 65 }}
  metadata={{
    dx: {
      chart: {
        metric1: "Happiness Score",
        metric2: "Economy (GDP per Capita)",
      },
    },
  }}
  initialView="scatter"
/>;
```

### Custom Views

If you pass `additionalViews` an object with keys corresponding to your view name (you can override existing view names or create your own) that has properties `Frame: ReactNode, controls: string, chartGenerator: Function => propsForReactNode, FacetFrame: ReactNode` you can create your own views.

```jsx
const BigNumberDiv = (props) => {
  const { bigAverage, bigTrend } = props;
  const { metricAverage, metrics } = props;

  return metrics.map((d, i) => {
    const diff = d.value - metricAverage;

    return (
      <div
        key={d.label}
        style={{
          textAlign: "center",
          width: "100px",
          border: "1px solid black",
          borderRadius: "5px",
          margin: "10px",
          padding: "10px",
          display: "inline-block",
        }}
      >
        <h3>{d.label}</h3>
        <h2>{d.value.toFixed(2)}</h2>
        <h1 style={{ color: diff > 0 ? "darkgreen" : "darkred" }}>
          {diff > 0 ? "+" : ""}
          {diff.toFixed(2)}
        </h1>
      </div>
    );
  });
};

const createBigNumber = (stateData, schema, chartSettings) => {
  const {
    chart: { metric1 },
  } = chartSettings;

  const metrics = stateData
    .map((d) => {
      const label = d.Country;
      const value = d[metric1];

      return {
        label,
        value,
      };
    })
    .sort((a, b) => b.value - a.value)
    .filter((d, i) => i < 12);

  const metricAverage = metrics.reduce((p, c) => (p += c.value), 0) / 12;

  return {
    frameSettings: {
      metricAverage,
      metrics,
    },
    //For facets sharing the same styling
    colorDim: "none",
    colorHash: {},
  };
};

const generateBigNumber = {
  Frame: BigNumberDiv,
  controls: "switch between modes",
  chartGenerator: createBigNumber,
  FacetFrame: BigNumberDiv,
};

const additionalViews = {
  bignumber: generateBigNumber,
};

const SampleControls = (props) => {
  const { updateChart, chart } = props;

  return (
    <div>
      <button
        onClick={() =>
          updateChart({ chart: { ...chart, metric1: "Happiness Score" } })
        }
      >
        Show Happiness Score
      </button>
      <button
        onClick={() =>
          updateChart({ chart: { ...chart, metric1: "Generosity" } })
        }
      >
        Show Generosity
      </button>
    </div>
  );
};

import DataExplorer, { Viz, Toolbar } from "@nteract/data-explorer";

<DataExplorer
  data={{ ...largeVizData }}
  OverrideVizControls={SampleControls}
  initialView="bignumber"
  additionalViews={additionalViews}
/>;
```
