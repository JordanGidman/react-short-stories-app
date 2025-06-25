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
  background-color: #f7f7f7;
  color: #1c1f2e;
  font-family: "Montserrat", sans-serif;
  font-size: 1.6rem;
  line-height: 1.5;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: #1c1f2e;
}
`;

export default GlobalStyles;
