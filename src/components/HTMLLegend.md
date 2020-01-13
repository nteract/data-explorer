You need to send colors to the legend via a hash and an array of colors. Optionally, you can also send values via a hash. The `setColor` function will send out the updated array of colors.

```jsx

const colorHash = {
    "Australia and New Zealand": "#1441A0",
    "Central and Eastern Europe": "#B3331D",
    "Eastern Asia": "#088EB2",
    "Latin America and Caribbean": "#4D430C",
    "Middle East and Northern Africa": "#B86117",
    "North America": "#E5C209",
    "Other": "grey",
    "Southeastern Asia": "#1DB390",
    "Southern Asia": "#E479A8",
    "Sub-Saharan Africa": "#417505",
    "Western Europe": "#DA752E"
}

const valueHash = {
    "Australia and New Zealand": 100,
    "Central and Eastern Europe": 88,
    "Eastern Asia": 50,
    "Latin America and Caribbean": 200,
    "Middle East and Northern Africa": 230,
    "North America": 17,
    "Other": 999,
    "Southeastern Asia": 500,
    "Southern Asia": 10,
    "Sub-Saharan Africa": 750,
    "Western Europe": 400
}

const changeFunction = (newColors) => {console.info(newColors)}

<HTMLLegend
    values={Object.keys(valueHash)}
    colorHash={colorHash}
    valueHash={valueHash}
    setColor={changeFunction}
/>

```