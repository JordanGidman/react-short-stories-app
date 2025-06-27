import styled from "styled-components";
import Navbar from "../components/Navbar";

const StyledAccount = styled.div`
  width: 95vw;
  height: 100vh;
  padding-top: 8rem;
  display: grid;
  grid-template-columns: 30% 70%;
`;

const StyledAside = styled.aside`
  display: flex;
  flex-direction: column;
  padding: 4rem;
`;

const StyledWrapper = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
`;

const StyledH1 = styled.h1`
  font-size: 4rem;
`;

const StyledStoryList = styled.ul``;

function Account() {
  //Needs to be a user logged in before allowing access to this page.
  //name
  //username
  //list of their stories
  //Edit profile options e.g change username
  //

  return (
    <>
      <Navbar />
      <StyledAccount>
        <StyledAside>
          <StyledH1>Giddy</StyledH1>
        </StyledAside>
        <StyledWrapper>
          <StyledH1>Your Stories</StyledH1>
          <StyledStoryList></StyledStoryList>
          <StyledH1>Your Likes</StyledH1>
        </StyledWrapper>
      </StyledAccount>
    </>
  );
}

export default Account;
