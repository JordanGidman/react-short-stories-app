import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import { faker } from "@faker-js/faker";
import Navbar from "../components/Navbar";
import DOMPurify from "dompurify";

const StyledBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`;

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 60% 40%;
  align-items: center;
  justify-content: space-between;
  padding: 0rem 4rem;
  margin: 6rem 0rem;
  width: 100vw;
  gap: 1.2rem;
`;
const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
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
const StyledImgWrapper = styled.div``;
const StyledImg = styled.img`
  border-radius: 1.6rem;
  width: 100%;
`;
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  font-size: 2rem;
`;

function Book() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(story);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const docRef = doc(db, "stories", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStory({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

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
        <StyledImgWrapper>
          <StyledImg src={story.img} alt={story.title} />
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
            titled "Test Story" there is one in every genre. As these are what
            user created storied with personalised styling will look like.
          </p>
          <p>{story.storyText}</p>
          <p>{story.storyText + " " + story.storyText}</p>
          <p>{story.storyText}</p>
          <p>{story.storyText}</p>
          <p>{story.storyText + " " + story.storyText}</p>
        </StyledBody>
      )}
    </StyledBook>
  );
}

export default Book;
