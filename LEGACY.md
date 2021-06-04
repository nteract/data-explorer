# Legacy (Do not use today)

## Installation Instructions

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
