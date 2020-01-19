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

Below is an example of a data explorer with an example of a valid data object.
Notice, though, that network visualization is not available, that's because that button is disabled if your data (like this data) only has one dimension (because network data requires some way of defining source & target).

By default the initial view is a grid. Click on the chart icons on the right to see different views.

```jsx static
import DataExplorer from "@nteract/data-explorer";

const basicData = {
  schema: {
    fields: [
      {
        name: "valueA",
        type: "integer"
      },
      {
        name: "valueB",
        type: "integer"
      },
      {
        name: "valueC",
        type: "integer"
      },
      {
        name: "label",
        type: "string"
      }
    ],
    primaryKey: []
  },
  data: [
    { valueA: 3, valueB: 5, valueC: 1, label: "first" },
    { valueA: 10, valueB: 1, valueC: 12, label: "second" },
    { valueA: -5, valueB: 8, valueC: 6, label: "third" }
  ]
};

<DataExplorer data={basicData} />;
```

### With Defaults

You can send chart settings by passing a metadata object to the metadata properties. Data Explorer chart settings are kept in the `dx.chart` property of metadata.
Chart settings refer to the metrics, dimensions and sort order for time series data (line charts). If you want to change higher level settings (such as the summaryType from the default violin plot to a boxplot) adjust those settings in the dx properties as below.

```jsx
import DataExplorer from "@nteract/data-explorer";

<DataExplorer
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
        "rgb(82,233,230)"
      ],
      chart: {
        metric1: "Happiness Score"
      }
    }
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
      metric1: "Economy (GDP per Capita)"
    }
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
  data={{...largeVizData}}
  metadata={{ dx: {
    facets: [
    {
      initialView: "bar",
      metadata: {
        dx: {
          hierarchyType: "treemap",
          metric1: "Generosity"
        }
      }
    },
    {
      initialView: "bar",
      dimFacet: { dim: "Region", value: "Western Europe" },
      metadata: {
        dx: {
          dim1: "Country",
          selectedDimensions: ["Country"],
          metric1: "Generosity"
        }
      }
    },
    {
      initialView: "bar",
      dimFacet: { dim: "Region", value: "North America" },
      metadata: {
        dx: {
          dim1: "Country",
          selectedDimensions: ["Country"],
          metric1: "Generosity"
        }
      }
    },
    {
      initialView: "bar",
      dimFacet: { dim: "Region", value: "Southeastern Asia" },
      metadata: {
        dx: {
          dim1: "Country",
          selectedDimensions: ["Country"],
          metric1: "Generosity"
        }
      }
    },
    {
      initialView: "bar",
      dimFacet: { dim: "Region", value: "Latin America and Caribbean" },
      metadata: {
        dx: {
          dim1: "Country",
          selectedDimensions: ["Country"],
          metric1: "Generosity"
        }
      }
    },
    {
      initialView: "hierarchy",
      metadata: {
        dx: {
          hierarchyType: "treemap",
          metric1: "Health (Life Expectancy)"
        }
      }
    }
  ]
  }
  } 
  }
  initialView="summary"
>
  <Viz />
</DataExplorer>;
```
