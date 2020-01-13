### Basic Data Explorer using DataExplorerDefault
The DataExplorerDefault component has the controls and viz integrated.
Sending a well-formatted data object (which means it has a schema with defined fields as well as a data prop with an array of corresponding datapoints) allows gives you the basic data explorer with all its functionality. Notice, though, that network visualization is not available, that's because that button is disabled if your data (like this data) only has one dimension (because network data requires some way of defining source & target).
By default the initial view is a grid. Click on the chart icons on the right to see different views.

```jsx
const basicData = {
    schema: {
        fields: [{
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
        }],
        primaryKey: []
    },
        data: [
            {valueA: 3, valueB: 5, valueC: 1, label: "first"},
            {valueA: 10, valueB: 1, valueC: 3, label: "second"},
            {valueA: 5, valueB: 8, valueC: 2, label: "third"}
        ]
};

<DataExplorerDefault
    data={basicData}
/>
```

### With Defaults
You can send chart settings by passing a metadata object to the metadata properties. Data Explorer chart settings are kept in the `dx.chart` property of metadata.
Chart settings refer to the metrics, dimensions and sort order for time series data (line charts). If you want to change higher level settings (such as the summaryType from the default violin plot to a boxplot) adjust those settings in the dx properties as below.

```jsx
import { largeVizData } from "../../doc_data/viz_data.js";

<DataExplorerDefault
    data={largeVizData}
    initialView="summary"
    metadata={{ dx: 
        { 
            summaryType: "boxplot",
            colors: ["orange", "lightgreen", "steelblue", "purple", "LightCoral", "MediumAquamarine", "Turquoise", "MidnightBlue", "Maroon", "Thistle"],
            chart: 
            {
                metric1:  "Happiness Score"
            } 
        } 
    }}
/>
```