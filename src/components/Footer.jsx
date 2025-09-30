import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";

const StyledFooter = styled.footer`
  display: grid;
  align-items: flex-start;
  color: #c0c0c0;
  grid-template-columns: 2fr 1fr 1fr 2fr 2fr;
  height: 30vh;
  width: 100vw;
  background-color: #1c1f2e;
  padding: 8rem 25%;
  color: #fff;
  font-size: 1.2rem;
`;

const StyledSocials = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  font-size: 1.6rem;
  color: #c0c0c0;
  font-weight: 600;
  text-transform: uppercase;
  div {
    display: flex;
    align-items: left;
    gap: 2rem;
    /* justify-content: space-between; */
  }
`;

const StyledSocialItem = styled.li`
  .icon {
    font-size: 2rem;
    color: #ffee34;
  }
`;

const StyledNavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* justify-content: space-between; */
  gap: 1.8rem;
  list-style: none;
  width: 100%;
  height: 100%;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
`;

const StyledNavItem = styled.li`
  display: flex;
`;

const StyledNavLink = styled(Link)`
  display: flex;
  color: #c0c0c0;
  transition: all 0.3s ease-in-out;

  &:hover {
    cursor: pointer;

    color: #85e9e1;
  }
`;

const StyledPersonalLink = styled.a`
  display: flex;
  color: #c0c0c0;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    cursor: pointer;
    color: #85e9e1;
  }
`;

const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 1.2rem;
  color: #c0c0c0;
  font-weight: 600;

  .icon {
    font-size: 13rem;
    color: lightblue;
  }
`;

const StyledForm = styled.form`
  color: #fff;
`;

const StyledFormH2 = styled.h2`
  font-size: 2rem;
  font-style: italic;
  font-weight: 600;
  font-family: "Playfair Display", serif;
  text-align: right;
  color: #c0c0c0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.6rem;
  background-color: transparent;
  color: #fff;
  border: none;
  border-bottom: 1px solid #fff;

  &::placeholder {
    font-style: italic;
    text-transform: capitalize;
  }
`;

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
`;

function Footer() {
  return (
    <StyledFooter>
      <StyledSocials>
        <p>Tell Your Story</p>
        <div>
          <StyledSocialItem>
            <ion-icon className="icon" name="logo-facebook"></ion-icon>
          </StyledSocialItem>
          <StyledSocialItem>
            <ion-icon className="icon" name="logo-instagram"></ion-icon>
          </StyledSocialItem>
          <StyledSocialItem>
            <ion-icon className="icon" name="logo-linkedin"></ion-icon>
          </StyledSocialItem>
          <StyledSocialItem>
            <ion-icon className="icon" name="mail-outline"></ion-icon>
          </StyledSocialItem>
        </div>
      </StyledSocials>
      <StyledNavLinks>
        <StyledNavItem>
          <StyledNavLink to={"/home"}>Home</StyledNavLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledNavLink to={"/write"}>Write Story</StyledNavLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledNavLink to={"/library"}>Library</StyledNavLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledNavLink to={"/mystories"}>My Stories</StyledNavLink>
        </StyledNavItem>
      </StyledNavLinks>
      <StyledNavLinks>
        <StyledNavItem>
          <StyledPersonalLink
            href="https://github.com/JordanGidman"
            target="_blank"
          >
            Github
          </StyledPersonalLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledPersonalLink
            href="https://www.linkedin.com/in/jordan-gidman-8376791a0/"
            target="_blank"
          >
            LinkedIn
          </StyledPersonalLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledPersonalLink
            href="https://jordan-gidman-portfolio.netlify.app/"
            target="_blank"
          >
            Portfolio
          </StyledPersonalLink>
        </StyledNavItem>
        <StyledNavItem>
          <StyledPersonalLink href="www.github.com">Email</StyledPersonalLink>
        </StyledNavItem>
      </StyledNavLinks>

      <StyledLogo>
        <p>powered by</p>
        <ion-icon className="icon" name="logo-react"></ion-icon>
      </StyledLogo>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          alert(
            "Sadly there are no stories to email you as they are all fake data generated with fakerJS"
          );
        }}
      >
        <StyledFormH2>Get Great Reads Right To Your Inbox</StyledFormH2>
        <StyledInput placeholder="Your email goes here..." />
        <StyledButton>Sign me up</StyledButton>
      </StyledForm>
    </StyledFooter>
  );
}

export default Footer;
