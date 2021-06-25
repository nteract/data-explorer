# nteract Data Explorer

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/nteract/examples/master?urlpath=%2Fnteract%2Fedit%2Fpython%2Fhappiness.ipynb)
[![Node.js CI](https://github.com/nteract/data-explorer/actions/workflows/node.js.yml/badge.svg)](https://github.com/nteract/data-explorer/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/nteract/data-explorer/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nteract/data-explorer/actions/workflows/codeql-analysis.yml)
[![npm version](https://badge.fury.io/js/%40nteract%2Fdata-explorer.svg)](https://www.npmjs.com/package/@nteract/data-explorer)

An automatic data visualization tool.

## [Interactive Documentation](https://data-explorer.nteract.io/)

Explore the [documentation](https://data-explorer.nteract.io/).

![Data Explorer Examples](https://user-images.githubusercontent.com/1863892/55675008-07632e80-5871-11e9-9dac-0a71450faf7b.gif)

## Creating Data Explorer

Read [Elijah Meeks](https://twitter.com/elijah_meeks)'s [post on designing the data explorer](https://blog.nteract.io/designing-the-nteract-data-explorer-f4476d53f897).

## Using the Data Explorer

To use Data Explorer in your project, use the following approach.

```bash
yarn add @nteract/data-explorer
```

Install `react` and `styled-components` if you are not already using them.

```bash
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

For expedited development, you can run:

```bash
yarn install
yarn styleguide
```

and the data explorer documentation will be run live locally and you can experiment with the settings and data.

Now you are ready to contribute :tada:
