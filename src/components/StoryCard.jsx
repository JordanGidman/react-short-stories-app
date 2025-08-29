import { faker } from "@faker-js/faker";
import styled from "styled-components";

const StyledStoryCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  background-image: url(${(props) => props.img});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const StyledTitle = styled.h2`
  font-size: 4rem;
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

function StoryCard({ story }) {
  return (
    <StyledStoryCard>
      <StyledImageBox img={story.img}></StyledImageBox>
      <StyledTextBox>
        <div>
          <StyledAuthor>{story.author}</StyledAuthor>
          <StyledTitle>{story.title}</StyledTitle>
        </div>
        {/* <p>{story.storyText}</p> */}
        <StyledSynopsis>{story.synopsis}</StyledSynopsis>
        <StyledGenre>{story.genre}</StyledGenre>
      </StyledTextBox>
    </StyledStoryCard>
  );
}

export default StoryCard;
