import styled from "styled-components";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
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
// const styledMainLinks = styled.div``;

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  console.log("Current User:", currentUser?.displayName);

  const navigate = useNavigate();

  return (
    <StyledNav>
      <Ul>
        <Li className="nav-link">
          <Button>LOGO</Button>
        </Li>
        <Li className="nav-link">
          <StyledButton>Featured</StyledButton>
        </Li>
        <Li className="nav-link">
          <StyledButton>Browse</StyledButton>
        </Li>
        <li className="nav-link">
          <StyledButton>Account</StyledButton>
        </li>

        <Li className="nav-link">
          {currentUser ? (
            <StyledButton>{currentUser.displayName}</StyledButton>
          ) : (
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          )}
        </Li>

        {currentUser && (
          <Li className="nav-link">
            <Button onClick={() => auth.signOut()}>Log out</Button>
          </Li>
        )}
      </Ul>
    </StyledNav>
  );
}

export default Navbar;
