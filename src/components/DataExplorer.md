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

### No Toolbar
If you want your Data Explorer to be set to a particular view and not be able to be switched, you can leave out the toolbar.

```jsx
import { largeVizData } from "../../doc_data/viz_data.js";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";

<DataExplorer
    data={largeVizData}
    initialView="hierarchy"
    metadata={{ dx: 
        { 
        hierarchyType: "treemap",
        metric1: "Economy (GDP per Capita)" }
        }
    }
>
    <Viz />
</DataExplorer>
```

### Faceting
You can turn on faceting by sending multiple DataExplorer prop objects to the DataExplorer's `facets` property. When you do so, the properties of each object sent to faceting will be extended onto the properties sent to the data explorer, resulting in multiple views (one for each object sent to `facets`).

```jsx
import { largeVizData, smallVizData } from "../../doc_data/viz_data.js";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";

<DataExplorer
    data={largeVizData}
    initialView="summary"
    facets={[
    {
        initialView: "bar",
        metadata: { dx: 
        { 
            hierarchyType: "treemap",
            metric1: "Generosity" }
        }
    },
    {
        initialView: "bar",
        dimFacet: { dim: "Region", value: "Western Europe" },
        metadata: { dx: 
        { 
            dim1: "Country",
            selectedDimensions: ["Country"],
            metric1: "Generosity"
        }

    }
    },
    {
        initialView: "bar",
        dimFacet: { dim: "Region", value: "North America" },
        metadata: { dx: 
        { 
            dim1: "Country",
            selectedDimensions: ["Country"],
            metric1: "Generosity"

        }
        }
    },
    {
        initialView: "bar",
        dimFacet: { dim: "Region", value: "Southeastern Asia" },
        metadata: { dx: 
        { 
            dim1: "Country",
            selectedDimensions: ["Country"],
            metric1: "Generosity"

        }
        }
    },
    {
        initialView: "bar",
        dimFacet: { dim: "Region", value: "Latin America and Caribbean" },
        metadata: { dx: 
        { 
            dim1: "Country",
            selectedDimensions: ["Country"],
            metric1: "Generosity"

        }
        }
    },
    {
        initialView: "hierarchy",
        metadata: { dx: 
        { 
            hierarchyType: "treemap",
            metric1: "Health (Life Expectancy)" }
        }
    }]}
>
    <Viz />
</DataExplorer>
```
