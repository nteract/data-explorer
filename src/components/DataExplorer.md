### Basic Usage
This component is a wrapper that can hold multiple (or no) Viz and Toolbar components. Here it is with `Toolbar` & `Viz` components. This allows you to compose it, for instance putting a `Toolbar` on the left and the right.

```jsx
import { largeVizData } from "../../doc_data/viz_data.js";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";

<DataExplorer
    data={largeVizData}
>
    <Toolbar />
    <Viz />
    <Toolbar />
</DataExplorer>
```

### Multiple Views
By turnng off legends and controls, you can create a simple dashboard.

```jsx
import { largeVizData } from "../../doc_data/viz_data.js";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";

<div>
<div style={{ display: "flex", height: "350px" }}>
<div style={{ width: "50%"}}>
<DataExplorer
    data={largeVizData}
    initialView="summary"
    metadata={{ dx: 
        { editable: false,
        showLegend: false }
        }
    }
>
    <Viz />
</DataExplorer>
</div>
<div style={{ width: "50%"}}>
<DataExplorer
    data={largeVizData}
    initialView="hierarchy"
    metadata={{ dx: 
        { editable: false,
        hierarchyType: "sunburst",
        metric1: "Economy (GDP per Capita)" }
        }
    }
>
    <Viz />
</DataExplorer>
</div>
</div>
<DataExplorer
    data={largeVizData}
>
    <Viz />
</DataExplorer>

</div>
```
