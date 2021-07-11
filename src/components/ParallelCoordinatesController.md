Because parallel coordinates is a very involved chart mode, there's a component for it.

```jsx
const { data, schema } = largeVizData;

const pcOptions = {
  colors: [
    "#5ebf72",
    "#275b52",
    "#83c0e6",
    "#6a2786",
    "#d76bac",
    "#573f56",
    "#9679a6",
    "#db11ac",
    "#2580fe",
    "#2e21d0",
    "#ae73fb",
    "#a1b27d",
    "#76480d",
    "#da9f63",
    "#a51409",
    "#fd7450",
    "#0e6e00",
    "#00d618",
  ],
  chart: { dim1: "Region" },
  primaryKey: ["index"],
  metrics: [
    {
      name: "index",
      type: "integer",
    },
    {
      name: "Happiness Rank",
      type: "integer",
    },
    {
      name: "Happiness Score",
      type: "number",
    },
    {
      name: "Standard Error",
      type: "number",
    },
    {
      name: "Economy (GDP per Capita)",
      type: "number",
    },
    {
      name: "Family",
      type: "number",
    },
    {
      name: "Health (Life Expectancy)",
      type: "number",
    },
    {
      name: "Freedom",
      type: "number",
    },
    {
      name: "Trust (Government Corruption)",
      type: "number",
    },
    {
      name: "Generosity",
      type: "number",
    },
    {
      name: "Dystopia Residual",
      type: "number",
    },
  ],
};

<ParallelCoordinatesController
  data={data}
  schema={schema}
  options={pcOptions}
/>;
```
