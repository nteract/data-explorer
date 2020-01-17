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
