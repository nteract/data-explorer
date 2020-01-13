import * as React from "react";
import { ChromePicker } from "react-color";
import styled from "styled-components";

interface Props {
  colors: string[];
  updateColor: (colors: string[]) => void;
}

interface State {
  colors: string;
  selectedColor: string;
  open: boolean;
  selectedPosition: number;
}

// NOTE: These styles could be extracted for each of the components used within.
//       In order to get this typescript & styled-components transition in place though,
//       For now this just matches the prior style structure exactly with one big wrapper
//       and one extracted component -- <PaletteButton />
const Wrapper = styled.div`
  & {
    margin: 30px 0;
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
  }
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    opacity: 0.5;
    font-size: 40px;
    line-height: 22px;
  }
  .close:hover {
    opacity: 1;
  }
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  h3 {
    margin: 0 0 20px;
  }
  .box {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    display: inline-block;
    margin: 0 20px 20px 0;
  }
  textarea {
    height: 184px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 5px;
    font-size: 14px;
    border-color: #ccc;
  }
`;

const ColorPickerWrapper = styled.div`
   {
    width: 225px;
  }
`;

const PalettePickerWrapper = styled.div`
   {
    margin-top: 30px;
  }
`;

const PaletteButton = styled.button`
  & {
    margin: 0 20px 10px 0;
    -webkit-appearance: none;
    padding: 5px 15px;
    background: white;
    border: 1px solid #bbb;
    border-radius: 3px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 14px;
    color: #555;
  }
  &:hover {
    border-color: #888;
    color: #222;
  }
`;

class PalettePicker extends React.PureComponent<Props, State> {
  static defaultProps = {
    metadata: {},
    height: 500
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      selectedColor: props.colors[0],
      selectedPosition: 0,
      colors: props.colors.join(",\n")
    };
  }

  openClose = () => {
    this.setState({
      open: !this.state.open,
      colors: this.props.colors.join(",\n")
    });
  };

  handleChange = (color: string, position: number) => {
    this.setState({ selectedColor: color, selectedPosition: position });
  };

  pickerChange = (color: { hex: string }) => {
    const { colors } = this.props;
    colors[this.state.selectedPosition] = color.hex;
    this.props.updateColor(colors);
    this.setState({ selectedColor: color.hex, colors: colors.join(",\n") });
  };

  colorsFromTextarea = () => {
    const parsedTextValue = this.state.colors
      .replace(/\"/g, "")
      .replace(/ /g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\r?\n|\r/g, "")
      .split(",");

    this.props.updateColor(parsedTextValue);
  };

  updateTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ colors: e.target.value });
  };

  render() {
    if (!this.state.open) {
      return (
        <div style={{ display: "inline-block" }}>
          <PaletteButton onClick={this.openClose}>Adjust Palette</PaletteButton>
        </div>
      );
    }

    const { colors } = this.props;

    return (
      <Wrapper>
        <div
          className="close"
          role="button"
          tabIndex={0}
          onClick={this.openClose}
          onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.keyCode === 13) {
              this.openClose();
            }
          }}
        >
          ×
        </div>
        <div className="grid-wrapper">
          <div>
            <h3>Select Color</h3>
            {colors.map((color, index) => (
              <div
                key={`color-${index}`}
                className="box"
                style={{ background: color }}
                role="button"
                tabIndex={0}
                onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.keyCode === 13) {
                    this.handleChange(color, index);
                  }
                }}
                onClick={() => this.handleChange(color, index)}
              />
            ))}
          </div>
          <div>
            <h3>Adjust Color</h3>
            <ColorPickerWrapper>
              <ChromePicker
                color={this.state.selectedColor}
                onChangeComplete={this.pickerChange}
              />
            </ColorPickerWrapper>
          </div>
          <div>
            <h3>Paste New Colors</h3>
            <textarea
              value={this.state.colors}
              onChange={this.updateTextArea}
            />
            <PaletteButton onClick={this.colorsFromTextarea}>
              Update Colors
            </PaletteButton>
          </div>
        </div>
        <PalettePickerWrapper>
          <a
            href={`http://projects.susielu.com/viz-palette?colors=[${colors
              .map(d => `"${d}"`)
              .join(",")}]&backgroundColor="white"&fontColor="black"`}
          >
            Evaluate This Palette with VIZ PALETTE
          </a>
        </PalettePickerWrapper>
      </Wrapper>
    );
  }
}

export default PalettePicker;
