import * as React from "react"

import styled from "styled-components"

interface Props {
  x: number
  y: number
}

export const safeDisplayValue = (value: any) =>
  value && value.toString ? value.toString() : value

// A little "mixin" for picking the :before on a tooltip
const beforeContent = (props: Props) => {
  if (props.x < 200 || props.x > 600) {
    return null
  }
  if (props.y < 200) {
    return `
      border-left: inherit;
      border-top: inherit;
      top: -8px;
      left: calc(50% - 15px);
      background: inherit;
      content: "";
      padding: 0px;
      transform: rotate(45deg);
      width: 15px;
      height: 15px;
      position: absolute;
      z-index: 99;
    `
  }

  return `
    border-right: inherit;
    border-bottom: inherit;
    bottom: -8px;
    left: calc(50% - 15px);
    background: inherit;
    content: "";
    padding: 0px;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    z-index: 99;
  `
}

const TooltipContent = styled.div.attrs((props: Props) => ({
  style: {
    transform: `translate(
      ${props.x < 200 ? "0px" : props.x > 600 ? "-100%" : "calc(-50% + 7px)"},
      ${props.y < 200 ? "10px" : "calc(-100% - 10px)"}
    )`
  }
}))`
  color: black;
  padding: 10px;
  z-index: 999999;
  width: 500px;
  background: white;
  border: 1px solid #888;
  border-radius: 5px;
  position: relative;

  & p {
    font-size: 14px;
  }

  & h3 {
    margin: 0 0 10px;
  }

  &:before {
    ${beforeContent}
  }
`
export default TooltipContent
