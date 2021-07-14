import * as Dx from "../utilities/types";

function stringOrFnAccessor(
  datapoint: Dx.Datapoint,
  accessor: string | Function,
) {
  return typeof accessor === "function"
    ? accessor(datapoint)
    : datapoint[accessor];
}

interface SubsortObject {
  array: Dx.Datapoint[];
  value: number;
  label: string;
}

export const sortByOrdinalRange = (
  oAccessor: string | ((datapoint: Dx.Datapoint) => string),
  rAccessor: string | (() => void),
  secondarySort: string,
  data: Dx.DataProps["data"],
): Dx.DataProps["data"] => {
  const subsortData: { [index: string]: SubsortObject } = {};
  let subsortArrays: SubsortObject[] = [];
  data.forEach((datapoint) => {
    const ordinalValue = stringOrFnAccessor(datapoint, oAccessor);
    if (!subsortData[ordinalValue]) {
      subsortData[ordinalValue] = { array: [], value: 0, label: ordinalValue };
      subsortArrays.push(subsortData[ordinalValue]);
    }
    subsortData[ordinalValue].array.push(datapoint);
    subsortData[ordinalValue].value += stringOrFnAccessor(datapoint, rAccessor);
  });

  subsortArrays = subsortArrays.sort((ordinalAData, ordinalBData) => {
    if (ordinalBData.value === ordinalAData.value) {
      if (ordinalAData.label < ordinalBData.label) {
        return -1;
      }
      if (ordinalAData.label > ordinalBData.label) {
        return 1;
      }
      return 1;
    }

    return ordinalBData.value - ordinalAData.value;
  });

  if (secondarySort !== "none") {
    subsortArrays.forEach((ordinalData) => {
      ordinalData.array = ordinalData.array.sort(
        (ordinalAData, ordinalBData) =>
          stringOrFnAccessor(ordinalBData, secondarySort) -
          stringOrFnAccessor(ordinalAData, secondarySort),
      );
    });
  }

  return subsortArrays.reduce(
    (combinedArray: Dx.Datapoint[], ordinalData) => [
      ...combinedArray,
      ...ordinalData.array,
    ],
    [],
  );
};

/*
  Returns uniques values in a column as strings
  Safely stringifies different data types, including null/undefined.
*/
export const getUniqueValues = (
  points: Dx.DataProps["data"],
  accessor: string,
): string[] => {
  return [
    ...new Set(
      points.map((d) => {
        const value = d[accessor];
        // Don't call stringify on a string, as it will add "quote" marks around your value.
        return typeof value === "string" ? value : JSON.stringify(value);
      }),
    ),
  ];
};
