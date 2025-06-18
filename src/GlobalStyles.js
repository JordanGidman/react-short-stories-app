import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

*{
  box-sizing: border-box;
  padding: 0; 
  margin: 0;
  
}

html {
  font-size: 62.5%

}

body {
  background-color: #fff;
  color: #000;
  font-family: "Montserrat", sans-serif;
  font-size: 1.6rem;
  line-height: 1.5;
  overflow-x: hidden;
}
`;

export default GlobalStyles;
