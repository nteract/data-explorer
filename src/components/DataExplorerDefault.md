Basic Viz Component
```jsx
//import { basicVizSettings } from "../../doc_data/viz_data.js"

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

<div>Here a thng
<DataExplorerDefault
data={basicData}
    initialView={"bar"}
/>
</div>
```