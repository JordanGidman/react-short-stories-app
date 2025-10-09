import { faker } from "@faker-js/faker";
import styled from "styled-components";
import placeholder from "../img/placeholder.jpg";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Error from "../pages/Error";

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
  padding: 2rem;
  gap: 2rem;
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
`;

const StyledAuthor = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: #1c1f2e;
`;

const StyledButton = styled(Button)`
  width: fit-content;
  font-size: 1.4rem;
  font-weight: 600;

  background-color: ${(props) =>
    props.$backgroundColor === "#ffee34" ? "#fff" : "#ffee34"};

  &:hover {
    background-color: ${(props) =>
      props.$backgroundColor === "#85e9e1" ? "#fff" : "#85e9e1"};
  }
`;

const StyledLink = styled(Link)``;

function StoryCard({ story }) {
  const [loadedImg, setLoadedImg] = useState(null);
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        {/* <p>{story.storyText}</p> */}
        <StyledSynopsis>
          {story.synopsis || "Synopsis not found"}
        </StyledSynopsis>
        <StyledGenre>{story.genre || "Misc"}</StyledGenre>
        <StyledLink to={`/library/${story.genre}/story/${story.id}`}>
          <StyledButton>Read</StyledButton>
        </StyledLink>
      </StyledTextBox>
    </StyledStoryCard>
  );
}

export default StoryCard;
