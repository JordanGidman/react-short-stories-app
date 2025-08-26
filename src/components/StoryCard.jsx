import styled from "styled-components";

const StyledStoryCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 2rem;
  background-color: #fff;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
`;

const StyledTitle = styled.h2`
  font-size: 4rem;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;
`;

function StoryCard({ story }) {
  return (
    <StyledStoryCard>
      <StyledTitle>{story.title}</StyledTitle>
      {/* <p>{story.storyText}</p> */}
      <p>{story.synopsis}</p>
      <p>{story.genre}</p>
      <p>By: {story.Author}</p>
    </StyledStoryCard>
  );
}

export default StoryCard;
