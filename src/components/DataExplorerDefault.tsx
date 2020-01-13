import * as React from "react";

import { Toolbar } from "./Toolbar";
import { Viz } from "./Viz";
import DataExplorer from "./DataExplorer";
import { Props } from "./DataExplorer";

const mediaType: Props["mediaType"] = "application/vnd.dataresource+json";

export const DataExplorerDefault: React.FunctionComponent<Props> & {
  MIMETYPE: Props["mediaType"];
} = (props: Partial<Props>) => {
  return (
    <DataExplorer {...props}>
      <Viz />
      <Toolbar />
    </DataExplorer>
  );
};

DataExplorerDefault.defaultProps = {
  mediaType
};
DataExplorerDefault.displayName = "DataExplorerDefault";

// For the jupyter extension to load MIMETYPE must be present.
DataExplorerDefault.MIMETYPE = mediaType;

export default DataExplorerDefault;
