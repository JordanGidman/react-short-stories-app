import styled from "styled-components";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

const StyledNav = styled.nav`
  display: flex;
  padding: 2rem 6rem;
  position: fixed;
  top: 0;
  width: 100vw;
  background-color: #1c1f2e;
  filter: drop-shadow(0rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3));
  height: 8rem;
  z-index: 10;
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rem;
  width: 100%;
`;

const Li = styled.li``;

const StyledButton = styled.button`
  background-color: transparent;
  font-weight: 300;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  transition: all 0.3s ease-in-out;

  span {
    background-color: #ffbe0b;
    border: none;
    color: #000;
    font-size: 2rem;

    transition: all 0.3s ease-in-out;
    font-weight: 500;
    border-radius: 2rem;
    padding: 0.6rem 4rem;
  }
  &:hover {
    scale: 1.1;
    cursor: pointer;
  }
`;

const StyledLink = styled(Link)`
  background-color: transparent;
  font-weight: 300;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  transition: all 0.3s ease-in-out;
  text-transform: capitalize;

  span {
    background-color: #ffbe0b;
    border: none;
    color: #000;
    font-size: 2rem;

    transition: all 0.3s ease-in-out;
    font-weight: 500;
    border-radius: 2rem;
    padding: 0.6rem 4rem;
  }
  &:hover {
    scale: 1.1;
    cursor: pointer;
  }
`;
// const styledMainLinks = styled.div``;

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  // console.log("Current User:", currentUser?.displayName);

  const navigate = useNavigate();

  return (
    <StyledNav>
      <Ul>
        <Li>
          <Button onClick={() => navigate("/")}>LOGO</Button>
        </Li>

        <Li>
          <StyledButton onClick={() => navigate("/write")}>
            Write Story
          </StyledButton>
        </Li>
        <Li>
          <StyledButton onClick={() => navigate("/library")}>
            Library
          </StyledButton>
        </Li>

        {currentUser && (
          <Li>
            <StyledButton onClick={() => navigate("/mystories")}>
              My Stories
            </StyledButton>
          </Li>
        )}

        <Li>
          {currentUser ? (
            <StyledButton>
              <StyledLink to="/account">{currentUser.displayName}</StyledLink>
            </StyledButton>
          ) : (
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          )}
        </Li>

        {currentUser && (
          <Li>
            <Button onClick={() => auth.signOut()}>Log out</Button>
          </Li>
        )}
      </Ul>
    </StyledNav>
  );
}

export default Navbar;
