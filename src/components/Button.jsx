import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #ffbe0b;
  border: none;
  color: #000;
  font-size: 1.6
  letter-spacing: 0.1rem;
  padding: 1rem 3rem;
  transition: all 0.3s ease-in-out;

  font-weight: 500;
  border-radius: 2rem;
  text-transform: uppercase;

  &:hover {
    background-color: #fff;
    color: #000;
    cursor: pointer;
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
