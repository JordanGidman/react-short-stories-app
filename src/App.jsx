import styled from "styled-components";
import Home from "./components/Home";
import GlobalStyles from "./GlobalStyles";
import Featured from "./components/Featured";

const StyledApp = styled.div``;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Home />
        <Featured />
      </StyledApp>
    </>
  );
}

export default App;
