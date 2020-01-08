import styled from "styled-components";

import reactTableStyles from "./react-table";
import reactTableFixedColumnStyles from "./react-table-hoc-fixed-columns";

interface ThemeProps {
  theme: string | undefined;
}

export default styled.div<ThemeProps>`
  /* React table style customization */
  width: 100%;

  .ReactTable .rt-thead.-header .rt-th {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#1e1e1e" : "#fff")};
  }
  .ReactTable.-striped .rt-tr.-odd > div {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#1e1e1e" : "#fff")};
  }

  .ReactTable.-striped .rt-tr.-even > div {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#111" : "#f7f7f7")};
  }

  .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
    /* 
    What does this selector do? 
    These classes were in our react-table style sheet previously
    color: var(--theme-app-fg);
    background: var(--cm-background); 
    */
  }

  .ReactTable .-pagination .-btn {
  }

  /* 
  These parts are mostly copied from the dependency packages, 
  but we remove some things that clash with us
  */
  ${reactTableStyles}
  ${reactTableFixedColumnStyles}
`;
