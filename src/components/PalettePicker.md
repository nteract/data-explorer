Simple controls for selecting a new color for your legend. The `updateColor` prop will send the array of colors selected.

```jsx
<PalettePicker
  colors={["red", "green", "yellow", "blue"]}
  selectedColor="red"
  selectedPosition={0}
  updateColor={(colors) => {
    console.info(colors);
  }}
/>
```
