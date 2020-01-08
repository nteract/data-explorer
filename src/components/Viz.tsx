import * as React from "react";
import styled from "styled-components";

import * as Dx from "../types";

const FlexItem = styled.div`
  flex: 1;
  min-width: 0;
`;

interface Props {
  children?: React.ReactNode;
  // How we tell the root DataExplorer to pass the visual/display as children:
  componentType?: Dx.ComponentType;
}

function PlaceHolder() {
  return <div>This should be a display element!</div>;
}

export const Viz: React.FunctionComponent<Partial<Props>> = ({
  children,
  componentType
}: Props) => {
  // In the future, the Viz component might be used for things like error boundaries
  return <FlexItem>{children}</FlexItem>;
};
Viz.defaultProps = { componentType: "viz", children: <PlaceHolder /> };
Viz.displayName = "Viz";
