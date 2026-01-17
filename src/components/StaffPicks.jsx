import styled from "styled-components";
import StoryCard from "./StoryCard";

const StyledPicks = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  min-height: calc(100vh - 7.8rem);
  background-color: #f7f7f7;

  h1 {
    background-color: #1c1f2e;
    padding: 1rem 2rem;
    font-family: "Playfair Display", serif;
    font-weight: 900;
    box-shadow: 0rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3);
    text-transform: capitalize;
    color: #fff;
    width: auto;

    span {
      font-style: italic;
    }
  }
  /* 1155px */
  @media (max-width: 72.2em) {
    grid-template-rows: 1fr 2fr !important;
  }
  @media (max-width: 34.4em) {
    h1 {
      font-size: 2.4rem;
    }
  }
`;

const StyledPicksSubheading = styled.div`
  font-size: 4.8rem;
  text-transform: uppercase;
  font-weight: 600;
  font-family: "Playfair Display", serif;

  @media (max-width: 34.4em) {
    font-size: 3.6rem;
  }
`;

const StyledPicksText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  padding: 4rem;
  text-transform: uppercase;

  p {
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: 0.4rem;
  }

  .underline {
    background-color: #000;
    height: 0.1rem;
    width: 30%;
  }

  @media (max-width: 34.4em) {
    p {
      font-size: 1.6rem;
    }
  }
`;

const StyledCardsBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100vw;
  gap: 2rem;
  padding: 4rem;

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    width: 100%;
  }

  /* 1155px */
  @media (max-width: 72.2em) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    height: auto !important;
  }
`;

function StaffPicks({ staffPicks }) {
  console.log(staffPicks);

  return (
    <StyledPicks id="staff-picks">
      <StyledPicksText>
        <h1>
          <span>Staff</span> Picks
        </h1>
        <div>
          <p>Check out what our staff are recommending</p>
          <StyledPicksSubheading>
            What should you read this week
          </StyledPicksSubheading>
        </div>
        <div className="underline"></div>
      </StyledPicksText>

      <StyledCardsBox>
        {staffPicks.length > 0 ? (
          staffPicks.map((story) => <StoryCard key={story.id} story={story} />)
        ) : (
          <p className="error">No staff picks available.</p>
        )}
      </StyledCardsBox>
    </StyledPicks>
  );
}

export default StaffPicks;
