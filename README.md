[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/nteract/examples/master?urlpath=%2Fnteract%2Fedit%2Fpython%2Fhappiness.ipynb)
[![<ORG_NAME>](https://circleci.com/gh/nteract/data-explorer.svg?style=svg)](<LINK>)
# nteract Data Explorer

## [Interactive Documentation](https://data-explorer.nteract.io/)

![Data Explorer Examples](https://user-images.githubusercontent.com/1863892/55675008-07632e80-5871-11e9-9dac-0a71450faf7b.gif)

[Read @emeek's post on designing the data explorer](https://blog.nteract.io/designing-the-nteract-data-explorer-f4476d53f897).

## Using the Data Explorer

```
yarn add @nteract/data-explorer
```

Install `react` and `styled-components` if you are not already using them.
```
yarn add react styled-components
```

The `data` prop must be a [tabular data resource `application/vnd.dataresource+json`](https://frictionlessdata.io/specs/tabular-data-resource/)

```jsx
// Default import complete with right side toolbar
import DataExplorer from "@nteract/data-explorer";

<DataExplorer data={data} />;
```

Or, with custom `Toolbar` position:

```jsx
// Individual components as named imports
import { DataExplorer, Toolbar, Viz } from "@nteract/data-explorer";

<DataExplorer data={data}>
  <Toolbar />
  <Viz />
</DataExplorer>;

// Toolbar is optional
<DataExplorer data={data}>
  <Viz />
</DataExplorer>;
```

## Hacking on the nteract Data Explorer

For expedited development, you can run `npm run styleguide` and the data explorer documentation will be run live locally and you can experiment with the settings and data.

### Now you are ready to contribute :tada:
