import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Footer from "../components/Footer";
import styled from "styled-components";
import { useEffect, useState } from "react";

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function MainLayout() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  function getResizeWidth(e) {
    setViewportWidth(e.target.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", getResizeWidth);

    return () => window.removeEventListener("resize", getResizeWidth);
  }, []);
  return (
    <StyledLayout>
      {viewportWidth < 929 ? <MobileNavbar /> : <Navbar />}
      <Outlet />
      <Footer />
    </StyledLayout>
  );
}

export default MainLayout;
