import styled from "styled-components";

const StyledInput = styled.input`
  width: 50%;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border: none;
  /* border-bottom: 1px solid rgb(0, 0, 0, 0.2); */
  box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.8);
  color: #1c1f2e;
  border-radius: 1.6rem;
  font-family: "Montserrat", sans-serif;

  &::placeholder {
    color: rgb(0, 0, 0, 0.5);
    font-style: italic;
    text-transform: capitalize;
  }
`;

function InputBox({
  className,
  placeholder,
  type = "text",
  onChange,
  defaultValue,
}) {
  return (
    <StyledInput
      className={className}
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
}

export default InputBox;
