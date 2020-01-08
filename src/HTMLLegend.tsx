import * as React from "react";
import styled from "styled-components";

import PalettePicker from "./PalettePicker";

interface HTMLLegendProps {
  values: string[];
  colorHash: { [index: string]: string };
  valueHash: { [index: string]: number };
  colors?: string[];
  setColor: (color: string[]) => void;
}

const CircleSpan = styled.span`
  & {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 20px;
    margin-bottom: -5px;
  }
`;

const LegendItemSpan = styled.span`
  & {
    display: inline-block;
    min-width: 80px;
    margin: 5px;
  }
`;

const LegendWrapper = styled.div`
  & {
    margin-top: 20px;
  }
`;

const HTMLLegend = ({
  values,
  colorHash,
  valueHash,
  colors = [],
  setColor
}: HTMLLegendProps) => {
  const updateColorFn: (newColorArray: string[]) => void = (
    newColorArray: string[]
  ) => {
    setColor(newColorArray);
  };
  return (
    <LegendWrapper>
      {(values.length > 18
        ? // limit the displayed values to the top 18 and bin everything else into Other
          [...values.filter((d, index) => index < 18), "Other"]
        : values
      ).map(
        (value, index) =>
          colorHash[value] && (
            <LegendItemSpan key={`legend-item-${index}`}>
              <CircleSpan
                style={{
                  background: colorHash[value]
                }}
              />
              <span className="html-legend-item">{value}</span>
              {(valueHash[value] &&
                valueHash[value] > 1 &&
                `(${valueHash[value]})`) ||
                ""}
            </LegendItemSpan>
          )
      )}
      {setColor && (
        <PalettePicker colors={colors} updateColor={updateColorFn} />
      )}
    </LegendWrapper>
  );
};

export default HTMLLegend;
