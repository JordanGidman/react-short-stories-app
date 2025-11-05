import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import DOMPurify from "dompurify";
import Comments from "../components/Comments";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Error from "./Error";

// Styled components (unchanged for brevity)
const StyledBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem;

  /* 930px */
  @media (max-width: 58.1em) {
    padding: 1rem;
    padding-top: 0rem;
    gap: 2rem;
  }
`;

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 60% 40%;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 4em;
  margin: 6rem 0rem;
  width: 100%;
  min-height: 40vh;
  gap: 1.2rem;
  background-color: #fff;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);

  /* 930px */
  @media (max-width: 58.1em) {
    grid-template-columns: 1fr;
    margin: 0;
    gap: 2rem;
    width: 100vw;
  }
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  gap: 2rem;
`;

const StyledH1 = styled.h1`
  font-size: 7rem;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;
  letter-spacing: 0.1rem;

  /* 930px */
  @media (max-width: 58.1em) {
    font-size: 6rem;
  }

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 5rem;
  }
`;

const StyledSubheading = styled.p`
  font-size: 1.8rem;
  span {
    font-weight: 600;
    color: #333;
  }

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 1.6rem;
  }
`;

const StyledSynopsis = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: #555;

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 1.6rem;
  }
`;

const StyledImgWrapper = styled.div`
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  height: 100%;
  background-repeat: no-repeat;

  /* 930px */
  @media (max-width: 58.1em) {
    height: 20vh;
  }
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #fff;
  padding: 4rem;
  font-size: 2rem;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  min-width: 100%;
  min-height: 30vh;

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 1.6rem;
  }
`;

const StyledLikes = styled.div`
  align-self: flex-end;
  margin: 2rem 0rem;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 2rem;

    ion-icon {
      color: #c92a2a;
      font-size: 3rem;
    }
  }

  /* 440px */
  @media (max-width: 27.5em) {
    span {
      font-size: 1.6rem;
    }
  }
`;

const StyledButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  .icon-star {
    color: #ffbe0b;
  }

  &:hover {
    cursor: pointer;
    color: #ffbe0b;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  white-space: nowrap;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${StyledButton}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

function Book() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  // --- State ---
  const [story, setStory] = useState(null);
  const [user, setUser] = useState(null);
  const [author, setAuthor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Story fetch ---
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const storyRef = doc(db, "stories", id);

    const unsub = onSnapshot(
      storyRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setStory({ id: docSnap.id, ...docSnap.data() });
          setError(null);
        } else {
          setError(new Error("Story not found."));
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  // --- Current user fetch (non-critical) ---
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Your user data could not be loaded.");
        }
      },
      (err) => toast.error("Error loading your user data.")
    );

    return () => unsub();
  }, [currentUser]);

  // --- Author fetch (non-critical) ---
  useEffect(() => {
    if (!story?.creatorID) return;

    const authorRef = doc(db, "users", story.creatorID);
    const unsub = onSnapshot(
      authorRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setAuthor({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Could not load author details.");
        }
      },
      (err) => toast.error("Error fetching author data.")
    );

    return () => unsub();
  }, [story?.creatorID]);

  //Like & Favorite handlers
  async function handleLike(userId, isLiked) {
    try {
      await updateDoc(doc(db, "stories", story.id), {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
      });
      toast.success(isLiked ? "Like removed." : "Story liked!");
    } catch (err) {
      toast.error("Could not update like status.");
    }
  }

  async function handleFavorite(userId, isFavorite) {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        favorites: isFavorite ? arrayRemove(story.id) : arrayUnion(story.id),
      });
      toast.success(
        isFavorite
          ? `Removed ${story.title} from favorites.`
          : `${story.title} favorited!`
      );
    } catch (err) {
      toast.error("Could not update favorites.");
    }
  }

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  // If story exists but author failed — continue rendering
  // const authorName = author?.displayName || "Unknown author";

  return (
    <StyledBook>
      <StyledHeader>
        <StyledTextWrapper>
          <StyledH1>{story.title}</StyledH1>
          <StyledSubheading>
            By: <span>{story.author || "Unknown author"}</span> | Genre:{" "}
            <span>{story.genre}</span>
          </StyledSubheading>
          <StyledSynopsis>{story.synopsis}</StyledSynopsis>
        </StyledTextWrapper>
        <StyledImgWrapper $backgroundImage={story.img} />
      </StyledHeader>

      {!story.isSeedData ? (
        <StyledBody
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(story.storyText),
          }}
        />
      ) : (
        <StyledBody>
          <p>
            This is a seed data story created using fakerJS. Full styling is{" "}
            <strong>not</strong> available. For the best example, please view
            any "Test Story" in the fantasy genre or create your own!
          </p>
          <p>{story.storyText}</p>
        </StyledBody>
      )}

      <StyledLikes>
        <span>
          {currentUser?.uid && (
            <>
              <StyledButton
                onClick={() =>
                  handleLike(
                    currentUser.uid,
                    story.likes?.includes(currentUser.uid)
                  )
                }
              >
                {story.likes?.includes(currentUser.uid) ? (
                  <ion-icon name="heart"></ion-icon>
                ) : (
                  <ion-icon name="heart-outline"></ion-icon>
                )}
                <Tooltip>
                  {story.likes?.includes(currentUser.uid)
                    ? "Remove Like"
                    : "Like Story"}
                </Tooltip>
              </StyledButton>
              {story.likes?.length || 0} likes
              <StyledButton
                onClick={() =>
                  handleFavorite(
                    currentUser.uid,
                    user?.favorites?.includes(story.id)
                  )
                }
              >
                {user?.favorites?.includes(story.id) ? (
                  <ion-icon className="icon-star" name="star"></ion-icon>
                ) : (
                  <ion-icon
                    className="icon-star"
                    name="star-outline"
                  ></ion-icon>
                )}
                <Tooltip>
                  {user?.favorites?.includes(story.id)
                    ? "Remove Favorite"
                    : "Favorite Story"}
                </Tooltip>
              </StyledButton>
            </>
          )}
        </span>
      </StyledLikes>

      <Comments storyId={story.id} />
    </StyledBook>
  );
}

export default Book;
