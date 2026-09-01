import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  limit,
  getDocs,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import CommentCard from "./CommentCard";
import ReactQuill from "react-quill-new";
import Button from "./Button";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Error from "../pages/Error";
import "react-quill-new/dist/quill.snow.css";
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";
import { constainsProfanity } from "../helpers/ProfanityCheck";
import { Timestamp } from "firebase/firestore";

const StyledComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  /* background-color: #fff; */
  /* padding: 4rem; */
  /* padding: 3% 3% 0 3%; */
  font-size: 2rem;
  /* box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8); */
  min-width: 100%;
  min-height: 30vh;
  grid-column: 2;
  /* margin-top: 4rem; */

  /* 930px */
  @media (max-width: 58.1em) {
    /* padding: 2rem; */
    /* width: 100vw; */
  }
`;

const StyledH3 = styled.h3`
  /* 930px */
  @media (max-width: 58.1em) {
    font-size: 1.8rem;
    /* padding: 3% 3% 0 3%; */
  }
`;

const StyledQuill = styled(ReactQuill)`
  /* margin-top: 4rem; */

  .ql-editor {
    min-height: 10rem;
    font-size: 1.6rem;
    font-family: "Montserrat", sans-serif;
    /* border: 0.1rem solid #000; */
  }

  /* 930px */
  @media (max-width: 58.1em) {
    width: 100%;
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

  /* 930px */
  @media (max-width: 58.1em) {
    width: auto;
  }

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 2.4rem;

  &:hover {
    scale: 1.15;
  }
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
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [lastComment, setLastComment] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // const matcher = new RegExpMatcher({
  //   ...englishDataset.build(),
  //   ...englishRecommendedTransformers,
  // });

  useEffect(() => {
    const docRef = doc(db, "stories", storyId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
        toast.error(`Issue fetching story: $`);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, [storyId]);

  // Fetch initial comments

  useEffect(() => {
    async function fetchComments() {
      try {
        const commentsQuery = query(
          collection(db, "comments"),
          where("storyID", "==", storyId),
          orderBy("createdAt", "desc"),
          limit(10),
        );

        const countQuery = query(
          collection(db, "comments"),
          where("storyID", "==", storyId),
        );

        const [querySnapshot, countSnapshot] = await Promise.all([
          getDocs(commentsQuery),
          getCountFromServer(countQuery),
        ]);

        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(commentsData);
        setCommentCount(countSnapshot.data().count);

        if (commentsData.length < 10) {
          setHasMoreComments(false);
        } else {
          setHasMoreComments(true);
        }

        if (querySnapshot.docs.length > 0) {
          setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();
  }, [storyId]);

  async function handleLoadMore() {
    if (!lastComment || loadingMore || !hasMoreComments) return;

    setLoadingMore(true);

    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("storyID", "==", storyId),
        orderBy("createdAt", "desc"),
        startAfter(lastComment),
        limit(10),
      );

      const querySnapshot = await getDocs(commentsQuery);

      const newComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments((prevComments) => [...prevComments, ...newComments]);

      if (querySnapshot.docs.length < 10) {
        setHasMoreComments(false);
      } else {
        setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    //Submit comment to backend

    //Validation - might be better to move to a seperate function or even a custom hook if we end up needing to reuse this logic for other forms
    if (!currentUser) {
      setSubmitting(false);
      return toast.error("You must be logged in to post a comment.");
    }

    if (comment.length <= 0) {
      setSubmitting(false);
      return toast.error("Cannot post an empty comment.");
    }

    const text = comment.replace(/<[^>]*>/g, "").trim();

    if (!text) {
      return toast.error("Cannot post an empty comment.");
    }

    if (constainsProfanity(text)) {
      setSubmitting(false);
      return toast.error(
        "Comment contains profanity that is not allowed. Please be respectful in the comments.",
      );
    }

    setSubmitting(true);
    try {
      const createdAt = Timestamp.now();
      // const createdAt = Timestamp.now();
      setSubmitting(true);
      const docRef = await addDoc(collection(db, "comments"), {
        comment: text,
        createdAt,
        author: currentUser.displayName,
        creatorID: currentUser.uid,
        storyID: storyId,
      });

      setComments((previousComments) => [
        {
          id: docRef.id,
          comment: text,
          createdAt,
          author: currentUser.displayName,
          creatorID: currentUser.uid,
          storyID: storyId,
        },
        ...previousComments,
      ]);
      setComment("");
      setCommentCount((prevCount) => prevCount + 1);

      toast.success("Comment posted");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(`Comment failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCommentDelete(commentId) {
    setComments((previousComments) =>
      previousComments.filter((comment) => comment.id !== commentId),
    );
  }

  return (
    <StyledComments>
      <StyledH3>
        {comments?.length > 0
          ? ` Comments (${commentCount})`
          : "No Comments Yet"}
      </StyledH3>

      <StyledForm>
        <StyledQuill
          theme="snow"
          placeholder={
            currentUser
              ? "Leave a comment..."
              : "You must be logged in to post a comment."
          }
          className="text-editor"
          value={comment}
          onChange={(e) => setComment(e)}
          readOnly={submitting || !currentUser}
          modules={{ toolbar: false }}
        />
        <StyledButton
          disabled={loading || !currentUser || submitting}
          onClick={handleCommentSubmit}
          name="post-comment"
          aria-label="Post comment"
        >
          Post
        </StyledButton>
      </StyledForm>

      <StyledList>
        {comments?.length > 0 &&
          comments.map((comment, index) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              story={story}
              onDelete={handleCommentDelete}
            />
          ))}
      </StyledList>

      {hasMoreComments && (
        <LoadMoreButton
          onClick={handleLoadMore}
          disabled={loadingMore}
          name="load-more-comments"
          aria-label="Load more comments"
        >
          {loadingMore ? (
            "Loading..."
          ) : (
            <ion-icon name="chevron-down-outline"></ion-icon>
          )}
        </LoadMoreButton>
      )}
    </StyledComments>
  );
}

export default Comments;
