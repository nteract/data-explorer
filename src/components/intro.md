### Basic Data Explorer

The simplest way to use the DataExplorer component is in its default configuration with controls and viz integrated. The only prop requirement is a dataset.

<!-- Data = {data: object[], schema: {fields: object[], primaryKey: ?string[] }} -->

```jsx
import DataExplorer from "./DataExplorer";

<DataExplorer data={largeVizData} />;
```

The `data` prop expects a well-formatted data object (which means it has a schema with defined fields as well as a data prop with an array of corresponding datapoints) allows gives you the basic data explorer with all its functionality. Notice, though, that network visualization is not available, that's because that button is disabled if your data (like this data) only has one dimension (because network data requires some way of defining source & target).
By default the initial view is a grid. Click on the chart icons on the right to see different views.

```jsx
import DataExplorer from "./DataExplorer";

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
import DataExplorer from "./DataExplorer";

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
