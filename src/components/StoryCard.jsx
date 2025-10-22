import { faker } from "@faker-js/faker";
import styled from "styled-components";
import placeholder from "../img/placeholder.jpg";
import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Error from "../pages/Error";
import { AuthContext } from "../context/AuthContext";

const StyledStoryCard = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  border-radius: 1.6rem;
  padding: 2rem;
  gap: 2rem;
  background-color: #fff;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    box-shadow: 0rem 0.3rem 4rem 0.2rem rgba(0, 0, 0, 0.2);
    scale: 1.02;
  }
`;

const StyledTextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 2rem;
  gap: 4rem;
  background-color: #fff;
`;
const StyledImageBox = styled.div`
  background-image: url(${(props) => props.$img || props.$placeholder});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: background-image 0.3s ease-in-out, filter 0.3s ease-in-out;
`;

const StyledTitle = styled.h2`
  font-size: 2.6rem;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;
`;

const StyledSynopsis = styled.p`
  font-size: 1.6rem;
  color: #555;
`;

const StyledGenre = styled.p`
  text-transform: capitalize;
  font-size: 1.4rem;
`;

const StyledAuthor = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: #1c1f2e;
`;

const StyledLikes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ion-icon {
    font-size: 2rem;
    color: #c92a2a;
  }
`;

const StyledButton = styled(Button)`
  width: fit-content;
  font-size: 1.4rem;
  font-weight: 600;
  padding: 1rem 2rem;

  background-color: ${(props) =>
    props.$backgroundColor === "#ffee34" ? "#fff" : "#ffee34"};

  &:hover {
    background-color: ${(props) =>
      props.$backgroundColor === "#85e9e1" ? "#fff" : "#85e9e1"};
  }
`;

const StyledButtons = styled.div`
  /* align-self: flex-end; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 2rem; */
  margin-top: 1rem;
  width: 100%;
`;

// const StyledLikesButton = styled.button`
//   position: relative;
//   border: none;
//   background-color: transparent;
//   transition: all 0.3s ease-in-out;

//   .icon-star {
//     color: #ffbe0b;
//   }

//   &:hover {
//     cursor: pointer;
//     color: #ffbe0b;
//   }
// `;

// const Tooltip = styled.span`
//   visibility: hidden;
//   opacity: 0;
//   transition: opacity 0.2s ease;
//   position: absolute;
//   bottom: 125%;
//   left: 50%;
//   transform: translateX(-50%);
//   background-color: #1c1f2e;
//   color: #fff;
//   padding: 0.4rem 0.8rem;
//   border-radius: 0.4rem;
//   font-size: 1.2rem;
//   white-space: nowrap;
//   z-index: 1;

//   &::after {
//     content: "";
//     position: absolute;
//     top: 100%;
//     left: 50%;
//     margin-left: -5px;
//     border-width: 5px;
//     border-style: solid;
//     border-color: #333 transparent transparent transparent;
//   }

//   ${StyledButton}:hover & {
//     visibility: visible;
//     opacity: 1;
//   }
// `;

const StyledLink = styled(Link)``;

function StoryCard({ story }) {
  const [loadedImg, setLoadedImg] = useState(null);
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const isCriticalError =
    !story.title &&
    !story.synopsis &&
    (!loadedImg || loadedImg === placeholder) &&
    (!author || author == "Unknown author");

  useEffect(() => {
    if (!story.creatorID) return;

    const userRef = doc(db, "users", story.creatorID);

    try {
      const unsub = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setAuthor(docSnap.data().displayName);
          } else {
            console.log("No such user exists");
          }
        },
        (error) => {
          console.log("Error fetching author:", error);
          setAuthor("Unknown author");
        }
      );

      return () => unsub();
    } catch (error) {
      console.log("Snapshot setup failed:", error);
      setError(error);
      toast.error(`Error: ${error.message}`);
    }
  }, [story]);

  useEffect(() => {
    if (!story.img) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      setLoadedImg(story.img);
      setLoading(false);
    };
    img.onerror = () => {
      console.log(`Image failed to load`, story.img);
      setLoadedImg(placeholder);
      setLoading(false);
    };
    img.src = story.img;
  }, [story.img]);

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

  if (isCriticalError)
    return (
      <Error error={{ message: "Error pulling stories from database." }} />
    );

  return (
    // <StyledStoryCard to={`/library/${story.genre}/book/${story.id}`}>
    <StyledStoryCard>
      {loading ? (
        <Spinner />
      ) : (
        <StyledImageBox
          $img={loadedImg}
          $placeholder={placeholder}
        ></StyledImageBox>
      )}
      <StyledTextBox>
        <div>
          <StyledAuthor>
            {author || story.author || "Unknown Author"}
          </StyledAuthor>
          <StyledTitle>{story.title || "Title not found"}</StyledTitle>
        </div>

        <StyledSynopsis>
          {/* {story.synopsis || "Synopsis not found"} */}
        </StyledSynopsis>
        <div>
          <StyledGenre>{story.genre || "Misc"}</StyledGenre>
          <StyledButtons>
            <StyledLink to={`/library/${story.genre}/story/${story.id}`}>
              <StyledButton>Read</StyledButton>
            </StyledLink>
            <StyledLikes>
              <ion-icon name="heart"></ion-icon>{" "}
              <span>{story.likes?.length || 0}</span>
            </StyledLikes>
          </StyledButtons>
        </div>
      </StyledTextBox>
    </StyledStoryCard>
  );
}

export default StoryCard;
