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
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Error from "../pages/Error";
import { toast } from "react-toastify";

const StyledEditStory = styled.div`
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

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 30vw;
  align-self: center;
`;

function EditStory() {
  //Need to refactor the inputs to be controlled components.
  //Need a check for user authentication before allowing access to this page - same for any comp that requires a signed in user
  //Need a check for isLoading state to show a loading spinner while the page is loading
  //Need to add error handling for the form submission
  //Need to add form validation to make sure all required fields are filled out
  //Need to add a way to save a draft of the story
  //Need to navigate user to the page of the story they just created.

  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const story = state ? state.story : null;
  const [storyText, setStoryText] = useState(story.storyText || "");
  const [title, setTitle] = useState(story.title || "");
  const [genre, setGenre] = useState(story.genre || "");
  const [synopsis, setSynopsis] = useState(story.synopsis || "");
  const [img, setImg] = useState(
    story.img || "https://picsum.photos/seed/hireme/600/400"
  );
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function handleSubmit(e, saveDraft) {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() || {};
      const isDraft = !!story.draftId;
      const isStory = !!story.id;

      //Editing a draft
      if (isDraft && saveDraft) {
        const updatedDrafts = (userData.drafts || []).map((d) =>
          d.draftId === story.draftId
            ? {
                ...d,
                title,
                genre,
                synopsis,
                img,
                storyText,
                editedAt: new Date(),
              }
            : d
        );
        await updateDoc(userRef, { drafts: updatedDrafts });
        toast.success("Draft updated!");
        navigate(`/account/${currentUser.uid}/drafts`);
      }

      //Editing an existing story and saving as draft
      else if (isStory && saveDraft) {
        const newDraft = {
          ...story,
          draftId: crypto.randomUUID(),
          storyId: story.id,
          title,
          genre,
          synopsis,
          img,
          storyText,
          editedAt: new Date(),
        };
        await updateDoc(userRef, { drafts: arrayUnion(newDraft) });
        toast.success("Draft saved!");
        navigate(`/account/${currentUser.uid}/drafts`);
      }

      //Posting a story or draft
      else {
        let storyIdToUpdate = story.id;
        if (isDraft) storyIdToUpdate = story.storyId; // use reference to original story

        await updateDoc(doc(db, "stories", storyIdToUpdate), {
          title,
          genre,
          synopsis,
          img,
          storyText,
          editedAt: new Date(),
        });

        // If it was a draft remove it from drafts
        if (isDraft) {
          const updatedDrafts = (userData.drafts || []).filter(
            (d) => d.draftId !== story.draftId
          );
          await updateDoc(userRef, { drafts: updatedDrafts });
        }

        toast.success("Story posted!");
        navigate(
          `/library/${genre.split("-").join(" ")}/story/${storyIdToUpdate}`
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(`Operation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyledEditStory>
      <Navbar />
      {!error ? (
        <StyledWrapper>
          <StyledForm onSubmit={(e) => handleSubmit(e)}>
            <StyledH1>Edit your story</StyledH1>
            <TitleInput
              type="text"
              // defaultValue={story ? story.title : ""}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your story *"
              disabled={loading}
            />

            <StyledSelect
              name="genre"
              // defaultValue={story ? story.genre : "placeholder"}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={loading}
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
              <StyledOption value="Science Fiction">
                Science Fiction
              </StyledOption>
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
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="A short synopsis of your story *"
              disabled={loading}
            />
            <StyledInputBox
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Image URL (Firebase no longer allows free image uploads leave blank for a placeholder or put any image url. )"
              disabled={loading}
            />
            <ReactQuill
              theme="snow"
              placeholder="Write your story here..."
              className="text-editor"
              onChange={(content) => setStoryText(content)}
              readOnly={loading}
              value={storyText}
            />
            <StyledButtons>
              <StyledButton
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, true)}
              >
                {loading ? "Updating..." : "Save Draft"}
              </StyledButton>

              <StyledButton
                disabled={loading}
                type="button"
                onClick={(e) => handleSubmit(e, false)}
              >
                {loading ? "Posting..." : "Post"}
              </StyledButton>
            </StyledButtons>
          </StyledForm>
        </StyledWrapper>
      ) : (
        <Error />
      )}
    </StyledEditStory>
  );
}

export default EditStory;
