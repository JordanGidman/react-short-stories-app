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
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

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
  min-height: 100vh;
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
      height: auto !important;
      .ql-editor {
        font-size: 1.6rem;
        font-family: "Montserrat", sans-serif;
        box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.8);
        font-style: italic;
        /* border-bottom: 1px solid rgb(0, 0, 0, 0.2); */
        height: auto;
        overflow-y: visible;

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

const StyledInputBox = styled(InputBox)`
  width: 100%;
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
  //Need to add error handling for the form submission
  //Need to add form validation to make sure all required fields are filled out
  //Need to add a way to save a draft of the story
  //Need to navigate user to the page of the story they just created.

  const { currentUser } = useContext(AuthContext);
  const [storyText, setStoryText] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("placeholder");
  const [synopsis, setSynopsis] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  // const { state } = useLocation();
  // const story = state ? state.story : null;
  const navigate = useNavigate();

  // console.log(story);

  async function handleSubmit(e) {
    console.log(e);
    e.preventDefault();

    //Capture input data not using controlled components because of issues saving to firebase will refactor later
    // const title = e.target[0].value;
    // const genre = e.target[1].value;

    // console.log("Genre selected:", genre);

    // const synopsis = e.target[2].value;
    // const img =
    //   e.target[3].value === ""
    //     ? "https://picsum.photos/seed/hireme/600/400"
    //     : e.target[3].value;

    //Save input data to firebase
    try {
      //Create a new story document and trim the p tag we get back from the library
      setLoading(true);
      const docRef = await addDoc(collection(db, "stories"), {
        title,
        genre,
        synopsis,
        img,
        storyText,
        creatorID: currentUser.uid,
        //Maybe add a isPublished field later for drafts
        createdAt: new Date(),
        author: currentUser.displayName,
        isSeedData: false,
        hidden: false,
      });

      //add the story id to the stories array of the user that created it
      await updateDoc(doc(db, "users", currentUser.uid), {
        stories: arrayUnion(docRef.id),
      });
      setLoading(false);
      navigate(`/library/${genre}/book/${docRef.id}`);
    } catch (err) {
      //replace with proper error handling later
      console.log(err.message);
    }
    //Navigate to the book page for this story
  }

  return (
    <StyledWriteBook>
      <Navbar />
      <StyledWrapper>
        <StyledForm onSubmit={(e) => handleSubmit(e)}>
          <StyledH1>Write your story</StyledH1>
          <TitleInput
            type="text"
            placeholder="Title of your story *"
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <StyledSelect
            name="genre"
            disabled={loading}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <StyledOption
              name="placeholder"
              value="placeholder"
              disabled
              hidden
            >
              Select Genre *
            </StyledOption>
            <StyledOption value="Fantasy">Fantasy</StyledOption>
            <StyledOption value="Science Fiction">Science Fiction</StyledOption>
            <StyledOption value="Gaming">Gaming</StyledOption>
            <StyledOption value="Mystery">Mystery</StyledOption>
            <StyledOption value="Romance">Romance</StyledOption>
            <StyledOption value="Horror">Horror</StyledOption>
            <StyledOption value="Thriller">Thriller</StyledOption>
            <StyledOption value="Historical">Historical</StyledOption>
            <StyledOption value="Adventure">Adventure</StyledOption>
            <StyledOption value="Action">Action</StyledOption>
            <StyledOption value="Crime">Crime</StyledOption>
            <StyledOption value="Comedy">Comedy</StyledOption>
            <StyledOption value="Religious">Religious</StyledOption>
            <StyledOption value="Political">Political</StyledOption>
            <StyledOption value="Existential">Existential</StyledOption>
            <StyledOption value="War">War</StyledOption>
            <StyledOption value="Educational">Educational</StyledOption>
            <StyledOption value="Drama">Drama</StyledOption>
            <StyledOption value="Other">Other</StyledOption>
          </StyledSelect>

          <StyledTextarea
            type="textarea"
            placeholder="A short synopsis of your story *"
            disabled={loading}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
          <StyledInputBox
            type="text"
            placeholder="Image URL (Firebase no longer allows free image uploads leave blank for a placeholder or put any image url. )"
            disabled={loading}
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            placeholder="Write your story here..."
            className="text-editor"
            value={storyText}
            onChange={(value) => setStoryText(value)}
            readOnly={loading}
          />
          <StyledButton disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </StyledButton>
          {/* Maybe a button for saving as draft */}
        </StyledForm>
      </StyledWrapper>
      <Footer />
    </StyledWriteBook>
  );
}

export default WriteBook;
