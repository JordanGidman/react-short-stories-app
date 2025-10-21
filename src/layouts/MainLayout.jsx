import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function MainLayout() {
  return (
    <StyledLayout>
      <Navbar />
      <Outlet />
      <Footer />
    </StyledLayout>
  );
}

export default MainLayout;
