import styled from "styled-components";
import Button from "./Button";

const StyledOffersText = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  margin-top: 4em;
  margin-bottom: 4em;
  h2 {
    font-size: 3rem;
    font-weight: 700;
    text-transform: capitalize;
    font-family: "Playfair Display", serif;
  }

  ion-icon {
    font-size: 4rem;
    /* --ionicon-stroke-width: 50px; */
  }

  div {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 80%;
  }

  .black-bar {
    height: 0.1rem;
    background-color: #1c1f2e;
    width: 100%;
  }
`;

const StoryCardBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 2rem;
  margin-bottom: 4em;

  @media (max-width: 35em) {
    grid-template-columns: 1fr;
  }
`;

const CustomStoryCard = styled.div`
  /* width: 50%; */
  min-height: 35vh;
  padding: 1rem;
  color: #fff;

  background-image:
    linear-gradient(to top, rgb(28, 31, 46) 0%, rgba(0, 0, 0, 0) 80%),
    url(${(props) => props.story.img || "/placeholder.jpg"});

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  .word-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    justify-self: flex-end;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 90%;
    justify-content: flex-end;
    z-index: 999;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 1.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
  }

  p {
    font-family: "Playfair Display", sans-serif;
    font-weight: 300;
    font-size: 2.6rem;
    font-weight: 700;
    text-transform: capitalize;
    margin-bottom: 4rem;
  }
`;

const StyledReadBtn = styled(Button)`
  width: fit-content;
`;

function RecommendationsSection({ recommendations }) {
  return (
    <>
      <StyledOffersText>
        <h2>Want something similar?</h2>
        <div>
          <ion-icon name="arrow-down-outline"></ion-icon>
          <div className="black-bar"></div>
        </div>
      </StyledOffersText>
      <StoryCardBox>
        {recommendations.map((rec) => (
          <CustomStoryCard key={rec.id} story={rec}>
            <div className="word-count">
              <ion-icon name="timer-outline"></ion-icon>
              {rec.storyText.split(" ").length} Words
            </div>
            <div className="info">
              <span>{rec.author}</span>
              <p>{rec.title}</p>

              <StyledReadBtn>Read</StyledReadBtn>
            </div>
          </CustomStoryCard>
        ))}
      </StoryCardBox>
    </>
  );
}

export default RecommendationsSection;
