import styled from "styled-components";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const StyledWriteBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  gap: 2rem;
  padding: 0% 5%;

  background-color: #f9f9f9;

  min-height: 100vh;
`;

const StyledH1 = styled.h1`
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  height: 100vh;
  padding-top: 10rem;
  padding-bottom: 3rem;

  flex: 1;

  .text-editor {
    font-size: 1.6rem;
    width: 100%;
    border-radius: 1.6rem;
    min-height: 3rem;
    flex: 1;
    padding-bottom: 4rem;
    font-family: "Montserrat", sans-serif;
    background-color: #fff;
    .ql-toolbar {
      border: none !important;
      box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.3);
    }

    .ql-container {
      border: none !important;
      .ql-editor {
        font-size: 1.6rem;
        font-family: "Montserrat", sans-serif;
        box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.8);
        font-style: italic;
        /* border-bottom: 1px solid rgb(0, 0, 0, 0.2); */

        &::before {
          text-transform: capitalize;
        }
      }
    }
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
`;

const TitleInput = styled(InputBox)`
  font-size: 4rem;
  background-color: transparent;
  padding-left: 0rem;
  width: 100%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: none;
`;

const StyledSelect = styled.select`
  font-size: 1.6rem;
  border-radius: 1.6rem;
  width: 20rem;
  padding: 1rem 2rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  text-transform: capitalize;
  font-style: italic;
  color: #1c1f2e;

  &[data-chosen-placeholder] {
    color: rgb(0, 0, 0, 0.5);
  }
`;

const StyledOption = styled.option`
  /* color: #1c1f2e; */
  color: #1c1f2e;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 7.8rem;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border: none;
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

const StyledButton = styled(Button)`
  width: 30vw;
  align-self: center;
`;

function WriteBook() {
  //Need to refactor the inputs to be controlled components.
  //Need a check for user authentication before allowing access to this page - same for any comp that requires a signed in user
  //Need a check for isLoading state to show a loading spinner while the page is loading

  const { currentUser } = useContext(AuthContext);
  const [storyText, setStoryText] = useState("");

  async function handleSubmit(e) {
    console.log(e);
    e.preventDefault();

    //Capture input data not using controlled components because of issues saving to firebase will refactor later
    const title = e.target[0].value;
    const genre = e.target[1].value;
    const synopsis = e.target[2].value;
    const readTime = e.target[3].value;
    // const storyText = e.target[4].value;
    console.log(currentUser.uid);

    //Save input data to firebase
    try {
      //Create a new story document and trim the p tag we get back from the library
      const docRef = await addDoc(collection(db, "stories"), {
        title,
        genre,
        synopsis,
        readTime,
        storyText: storyText.split("<p>").join("").split("</p>").join(""),
      });

      console.log(docRef);
      //add the story id to the stories array of the user that created it
      await updateDoc(doc(db, "users", currentUser.uid), {
        stories: arrayUnion(docRef.id),
      });
    } catch (err) {
      //replace with proper error handling later
      console.log(err.message);
    }
    //Maybe navigate to the book page for this story
  }

  return (
    <StyledWriteBook>
      <Navbar />
      <StyledWrapper>
        <StyledForm onSubmit={(e) => handleSubmit(e)}>
          <StyledH1>Write your story</StyledH1>
          <TitleInput type="text" placeholder="Title of your story *" />

          <StyledSelect name="genre" defaultValue={"placeholder"}>
            <StyledOption
              name="placeholder"
              value="placeholder"
              disabled
              hidden
            >
              Select Genre *
            </StyledOption>
            <StyledOption value="fantasy">Fantasy</StyledOption>
            <StyledOption value="science-fiction">Science Fiction</StyledOption>
            <StyledOption value="mystery">Mystery</StyledOption>
            <StyledOption value="romance">Romance</StyledOption>
            <StyledOption value="horror">Horror</StyledOption>
            <StyledOption value="thriller">Thriller</StyledOption>
            <StyledOption value="historical">Historical</StyledOption>
            <StyledOption value="adventure">Adventure</StyledOption>
            <StyledOption value="Action">Action</StyledOption>
            <StyledOption value="comedy">Comedy</StyledOption>
            <StyledOption value="drama">Drama</StyledOption>
            <StyledOption value="other">Other</StyledOption>
          </StyledSelect>

          <StyledTextarea
            type="textarea"
            placeholder="A short synopsis of your story *"
          />
          <InputBox type="text" placeholder="Estimated read time (minutes) *" />
          <ReactQuill
            theme="snow"
            placeholder="Write your story here..."
            className="text-editor"
            onChange={setStoryText}
          />
          <StyledButton>Post</StyledButton>
          {/* Maybe a button for saving as draft */}
        </StyledForm>
      </StyledWrapper>
    </StyledWriteBook>
  );
}

export default WriteBook;
