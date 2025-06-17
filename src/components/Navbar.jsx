import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  font-weight: 600;
  padding: 4rem 2.4rem;
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Li = styled.li``;

const Button = styled.button``;

function Navbar() {
  return (
    <Nav>
      <Ul>
        <Li className="nav-link">
          <button>Home</button>
        </Li>
        <Li className="nav-link">
          <button>Browse</button>
        </Li>
        <li className="nav-link">
          <button>Account</button>
        </li>
        <Li className="nav-link">
          <button>Sign In</button>
        </Li>
      </Ul>
    </Nav>
  );
}

export default Navbar;
