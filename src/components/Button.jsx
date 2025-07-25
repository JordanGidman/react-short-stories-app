import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #ffee34;
  border: none;
  color: #000;
  font-size: 1.6rem;
  letter-spacing: 0.1rem;
  padding: 1rem 3rem;
  transition: all 0.4s ease-in-out;

  font-weight: 500;
  border-radius: 2rem;
  text-transform: uppercase;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #85e9e1;
    cursor: pointer;
  }

  &:visited {
    box-shadow: none;
  }

  &:active {
    box-shadow: none;
  }
`;

function Button({ className, onClick, children }) {
  return (
    <StyledButton className={className} onClick={onClick}>
      {children}
    </StyledButton>
  );
}

export default Button;
