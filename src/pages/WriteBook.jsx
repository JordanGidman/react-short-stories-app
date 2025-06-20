import styled from "styled-components";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputBox from "../components/InputBox";

const StyledWriteBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 100vh;
`;

const StyledH1 = styled.h1``;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 60%;
`;

// const StyledInput = styled.input``;

const BookInput = styled(InputBox)`
  width: 100%;
  min-height: 50%;
`;

function WriteBook() {
  //1)title
  //2)Genre
  //3)Synopsis
  //4)Book
  //5)Read Time

  return (
    <StyledWriteBook>
      <Navbar />
      <StyledH1>
        Write your own short story and share it with the world!
      </StyledH1>
      <StyledForm>
        <InputBox type="text" placeholder="Title of your story" />
        <InputBox type="text" placeholder="Genre of your story" />
        <InputBox type="text" placeholder="Synopsis of your story" />
        <BookInput as="textarea" placeholder="Write your story here..." />
        <InputBox type="text" placeholder="Estimated read time (minutes)" />
        <Button>Submit</Button>
      </StyledForm>
    </StyledWriteBook>
  );
}

export default WriteBook;
