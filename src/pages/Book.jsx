import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import { faker } from "@faker-js/faker";
import Navbar from "../components/Navbar";
import DOMPurify from "dompurify";
import Comments from "../components/Comments";
import { AuthContext } from "../context/AuthContext";

const StyledBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem;
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
`;
const StyledSubheading = styled.p`
  font-size: 1.8rem;

  span {
    font-weight: 600;
    color: #333;
  }
`;
const StyledSynopsis = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: #555;
`;
const StyledImgWrapper = styled.div`
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  /* border-radius: 1.6rem; */
  height: 100%;
  background-repeat: no-repeat;
`;
// const StyledImg = styled.img`
//   border-radius: 1.6rem;
//   width: 100%;
// `;
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

// Tooltip text
const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;

  position: absolute;
  bottom: 125%; /* show above button */
  left: 50%;
  transform: translateX(-50%);

  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  white-space: nowrap;

  z-index: 1;

  /* arrow, ill be honest i took this from the internet, thank you random person */
  &::after {
    content: "";
    position: absolute;
    top: 100%; /* point downwards */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${StyledButton}:hover & {
    visibility: visible;
    opacity: 1;
    .icon {
      font-size: 2.4rem;
    }
  }
`;

function Book() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  console.log(story);
  console.log(user);

  useEffect(() => {
    const docRef = doc(db, "stories", id);

    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    });

    return () => unsub(); // cleanup on unmount
  }, [id]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = doc(db, "users", currentUser?.uid);

    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such user exists");
      }
    });

    return () => unsub();
  }, [currentUser]);

  async function handleLike(userId, isLiked) {
    console.log(userId);

    try {
      if (!isLiked) {
        await updateDoc(doc(db, "stories", story.id), {
          likes: arrayUnion(userId),
        });
      } else {
        await updateDoc(doc(db, "stories", story.id), {
          likes: arrayRemove(userId),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function handleFvorite(userId, isFavorite) {
    console.log(userId);
    console.log(isFavorite);

    try {
      if (!isFavorite) {
        await updateDoc(doc(db, "users", currentUser?.uid), {
          favorites: arrayUnion(story.id),
        });
      } else {
        await updateDoc(doc(db, "users", currentUser?.uid), {
          favorites: arrayRemove(story.id),
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!story) return <p>story not found.</p>;

  return (
    <StyledBook>
      <Navbar />
      <StyledHeader>
        <StyledTextWrapper>
          <StyledH1>{story.title}</StyledH1>
          <StyledSubheading>
            By <span>{story.author}</span> | Genre: <span>{story.genre}</span>
          </StyledSubheading>
          <StyledSynopsis>{story.synopsis}</StyledSynopsis>
        </StyledTextWrapper>
        <StyledImgWrapper $backgroundImage={story.img}>
          {/* <StyledImg src={story.img} alt={story.title} /> */}
        </StyledImgWrapper>
      </StyledHeader>
      {!story.isSeedData ? (
        <StyledBody
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(story.storyText),
          }}
        ></StyledBody>
      ) : (
        <StyledBody>
          <p>
            This is a seed data story. Full styling is <strong>not</strong>{" "}
            available. For the best example please look at any of the stories
            titled "Test Story" in the fantasy genre. As these are what user
            created storied with personalised styling will look like, or create
            your own short story to share with others!
          </p>
          <p>{story.storyText}</p>
          <p>{story.storyText + " " + story.storyText}</p>
          <p>{story.storyText}</p>
          <p>{story.storyText}</p>
          <p>{story.storyText + " " + story.storyText}</p>
        </StyledBody>
      )}
      <StyledLikes>
        <span>
          <StyledButton
            onClick={() =>
              handleLike(
                currentUser.uid,
                story.likes?.find((like) => like === currentUser.uid)
              )
            }
          >
            {story.likes?.find((like) => like === currentUser.uid) ? (
              <ion-icon name="heart"></ion-icon>
            ) : (
              <ion-icon name="heart-outline"></ion-icon>
            )}
            <Tooltip>
              {story.likes?.find((like) => like === currentUser.uid)
                ? "Remove Like"
                : "Like Story"}
            </Tooltip>
          </StyledButton>
          {story.likes?.length || 0} likes
          <StyledButton
            onClick={() =>
              handleFvorite(
                currentUser.uid,
                user?.favorites?.find((favorite) => favorite === story.id)
              )
            }
          >
            {user?.favorites?.find((favorite) => favorite === story.id) ? (
              <ion-icon className="icon-star" name="star"></ion-icon>
            ) : (
              <ion-icon className="icon-star" name="star-outline"></ion-icon>
            )}
            <Tooltip>
              {user?.favorites?.find((favorite) => favorite === story.id)
                ? "Remove Favorite"
                : "Favorite Story"}
            </Tooltip>
          </StyledButton>
        </span>
      </StyledLikes>
      <Comments storyId={story.id} />
    </StyledBook>
  );
}

export default Book;
