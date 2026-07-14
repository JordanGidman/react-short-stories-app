import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  gap: 2rem;
  align-items: center;

  margin-top: 4rem;

  @media (max-width: 64em) {
    margin-top: 2rem;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
`;

const StyledWrapper = styled.div`
  flex: 1;
  border-left: 1px solid black;
  padding-left: 2rem;

  @media (max-width: 64em) {
    border-left: none;
    padding: 0rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const StyledAuthor = styled(Link)`
  text-decoration: none;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-decoration: none;
  /* padding-bottom: 0.9em; */
`;
const StyledTitle = styled.h1`
  text-transform: capitalize;
  margin-bottom: 4rem;
  margin-top: 0.9em;
  /* margin-bottom: auto; */
`;
const StyledWordCount = styled.div`
  font-size: 1.1em;
  font-family: "Montserrat", sans-serif;
  color: #848796;
  font-weight: 500;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ion-icon {
      font-size: 2.2rem;
      --ionicon-stroke-width: 50px;
      color: #1c1f2e;
    }
  }

  @media (max-width: 64em) {
    justify-content: center;
  }
`;
const StyledCountry = styled.p`
  font-size: 1.8rem;
  writing-mode: tb-rl;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  color: #848796;
  letter-spacing: 0.2rem;
  rotate: 180deg;

  @media (max-width: 64em) {
    display: none;
  }
`;

function StoryHeader({ story, author, country, countryData }) {
  return (
    <StyledHeader>
      <StyledCountry>
        {country && country.length < 15
          ? country
          : countryData?.find((c) => c.code === author?.country)?.code ||
            "Loading..."}
      </StyledCountry>
      <StyledWrapper>
        <StyledAuthor to={`/author/${story.creatorID}`}>
          {story?.author}
        </StyledAuthor>
        <StyledTitle>{story?.title}</StyledTitle>
        <StyledWordCount>
          <div>
            <ion-icon name="timer-outline"></ion-icon>
            <span>{story?.storyText?.split(" ").length || 0} words</span>
          </div>
        </StyledWordCount>
      </StyledWrapper>
    </StyledHeader>
  );
}

export default StoryHeader;
