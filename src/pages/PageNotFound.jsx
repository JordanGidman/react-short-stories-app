import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const StyledNotFound = styled.div`
  height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  gap: 2rem;
  padding: 0% 5%;

  background-color: #f9f9f9;

  /* min-height: 100vh; */
`;

const StyledInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* gap: 2rem; */
  background-color: #fff;
  padding: 6rem 6rem;
  box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.3);

  .large-icon {
    font-size: 10rem;
    margin-bottom: 2rem;
    color: rgb(28, 31, 46, 0.8);
  }
`;

const StyledH1 = styled.h1`
  font-size: 4rem;
  color: rgb(28, 31, 46, 0.8);
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  /* font-style: italic; */
  /* white-space: nowrap; */
`;

const StyledSubheading = styled.p`
  font-size: 1.8rem;
  color: #888;
  text-align: center;
`;

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  margin-top: 4rem;
  width: 100%;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 50%;
  /* padding: 1rem 6rem; */

  .icon {
    font-size: 2.4rem;
  }
`;

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <StyledNotFound>
      <StyledInfoBox>
        <ion-icon name="help-circle-outline" className="large-icon"></ion-icon>
        <StyledH1>404 - Page Not Found</StyledH1>
        <StyledSubheading>
          Sorry, the page you are looking for was not found. If the issue
          persists please check the URL or go back/return to the homepage.
        </StyledSubheading>
        <StyledButtons>
          <StyledButton onClick={() => navigate(-1)}>
            <ion-icon name="arrow-back-outline" className="icon"></ion-icon> Go
            Back
          </StyledButton>
          <StyledButton onClick={() => navigate("/")}>
            <ion-icon name="home-outline" className="icon"></ion-icon> Home
          </StyledButton>
        </StyledButtons>
      </StyledInfoBox>
    </StyledNotFound>
  );
}

export default PageNotFound;
