[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/nteract/examples/master?urlpath=%2Fnteract%2Fedit%2Fpython%2Fhappiness.ipynb)

# nteract Data Explorer

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

For expedited development, we recommend using the [Jupyter Extension](https://github.com/nteract/nteract/tree/master/applications/jupyter-extension) to contribute.

_Note: the desktop app can be used instead, but you'll have to manually reload to see changes_

## Installation

### 1. Setup the monorepo

Navigate to the base directory of the repo and install all dependencies

```bash
yarn
```

### 2. Setup Jupyter Extension

**_Note: this requires Python >= 3.6_**

Now, install the Python package

```bash
cd applications/jupyter-extension
pip install -e .
jupyter serverextension enable nteract_on_jupyter
```

### 3. Build JS assets and run a Jupyter server with hot reloading

First we need to run the webpack server to live reload javascript and html assets. Anywhere in the nteract repository, run

```bash
npx lerna run hot --scope nteract-on-jupyter --stream
```

In another terminal, go to the directory that you want to run notebooks from and run

```bash
jupyter nteract --NteractConfig.asset_url="http://localhost:8080/"
```

The --NteractConfig.asset_url flag tells the Jupyter server where the webpack server will be serving the assets.

Once the assets have been built, you won't need to refresh the page, but you may need to manually refresh the page if it loads before the assets are built.

### 4. Initialize data explorer in the notebook

In the notebook launched from step 3, run the following code in a cell before anything else :arrow_down:

```python
import pandas as pd
pd.options.display.html.table_schema = True
pd.options.display.max_rows = None
```

### Now you are ready to contribute :tada:
