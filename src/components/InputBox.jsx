import styled from "styled-components";

const StyledInput = styled.input`
  width: 50%;
  padding: 1rem 2rem;
  text-transform: capitalize;
  font-size: 1.6rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  color: #1c1f2e;
  &::placeholder {
    color: rgb(0, 0, 0, 0.5);
    font-style: italic;
  }
`;

function InputBox({ className, placeholder, type = "text", onChange }) {
  return (
    <StyledInput
      className={className}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
}

export default InputBox;
