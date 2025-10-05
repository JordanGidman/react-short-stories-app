import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import CommentCard from "./CommentCard";
import ReactQuill from "react-quill-new";
import Button from "./Button";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const StyledComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #fff;
  padding: 4rem;
  font-size: 2rem;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  min-width: 100%;
  min-height: 30vh;
  /* margin-top: 4rem; */
`;

const StyledQuill = styled(ReactQuill)`
  /* margin-top: 4rem; */

  .ql-editor {
    min-height: 10rem;
    font-size: 1.6rem;
    font-family: "Montserrat", sans-serif;
  }
`;

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  width: 20%;
  align-self: flex-end;
`;

function Comments({ storyId }) {
  //Pull the comments from the backend using the story ID which will be passed in and render to screen
  //Render a form to add a comment
  //On submit push to backend and update the comments list
  //Post/edit/delete comments will require user to be logged in

  const [story, setStory] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const docRef = doc(db, "stories", storyId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, [storyId]);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    //Submit comment to backend

    if (!currentUser) return alert("You must be logged in to post a comment.");

    try {
      setLoading(true);
      await updateDoc(doc(db, "stories", story.id), {
        comments: arrayUnion({
          comment,
          createdAt: new Date(),
          author: currentUser.displayName,
          creatorID: currentUser.uid,
        }),
      });
      setComment("");
      setLoading(false);
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      toast.success("Comment posted");
    }

    //Clear form
    //Update comments list
    console.log("Submitting comment:", comment);
  }

  return (
    <StyledComments>
      <h3>
        {story?.comments?.length > 0
          ? `${story.comments.length} Comments`
          : "No Comments Yet"}
      </h3>
      <StyledList>
        {story?.comments?.length > 0 &&
          story.comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))}
      </StyledList>
      <StyledForm>
        <StyledQuill
          theme="snow"
          placeholder="Leave a comment..."
          className="text-editor"
          value={comment}
          onChange={(value) => setComment(value)}
          readOnly={loading}
          modules={{ toolbar: false }}
        />
        <StyledButton disabled={loading} onClick={handleCommentSubmit}>
          Post
        </StyledButton>
      </StyledForm>
    </StyledComments>
  );
}

export default Comments;
