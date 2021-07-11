```jsx
import { TreeIcon } from "../utilities/icons";

<div>
  <IconButton
    message={"Sample Button"}
    onClick={() => {
      "Clicked a button";
    }}
    title="Title of sample button"
    selected={false}
  >
    <TreeIcon />
  </IconButton>
  <IconButton
    message={"Sample Button"}
    onClick={() => {
      "Clicked a button";
    }}
    title="Title of sample button"
    selected={true}
  >
    <TreeIcon />
  </IconButton>
</div>;
```
