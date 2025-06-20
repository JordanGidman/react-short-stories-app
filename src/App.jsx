import styled from "styled-components";
import Home from "./pages/Home";
import GlobalStyles from "./GlobalStyles";
import SignIn from "./pages/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import SignUp from "./pages/SignUp";
import { AuthContextProvider } from "./context/AuthContext";
import About from "./pages/About";
import Account from "./pages/Account";
import WriteBook from "./pages/WriteBook";

const StyledApp = styled.div``;

function App() {
  return (
    <AuthContextProvider>
      <StyledApp>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="account" element={<Account />} />
            <Route path="write" element={<WriteBook />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </StyledApp>
    </AuthContextProvider>
  );
}

export default App;
