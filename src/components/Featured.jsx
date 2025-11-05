import styled from "styled-components";
import Button from "./Button";

const FeaturedButton = styled(Button)`
  font-weight: 900;

  @media (max-width: 60em) {
    font-size: 1.2rem;
  }
`;

const StyledBanner = styled.div`
  width: 100%;
  min-height: 30vh;
  background-color: #85e9e1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 2rem 4rem;

  h1 {
    font-size: 5rem;
    span {
      font-family: "Playfair Display", serif;
      font-weight: 900;
    }

    .highlight {
      font-style: italic;
      font-weight: 700;
    }
  }

  p {
    width: 60%;
    text-align: center;
    font-size: 1.4rem;
    max-width: 40%;
    margin-top: 1rem;
    color: #000;
    margin-bottom: 2rem;
  }

  @media (max-width: 60em) {
    h1 {
      font-size: 3.5rem;
    }

    p {
      max-width: 90%;
    }
  }

  @media (max-width: 42.5em) {
    text-align: center;
    padding: 1rem 1rem;
  }
`;

function Featured() {
  function handleScrollTo() {
    console.log(window.innerWidth);

    const section = document.getElementById("staff-picks");
    if (section) {
      const yOffset = -80;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.innerWidth > 930
        ? window.scrollTo({ top: y, behavior: "smooth" })
        : section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="featured">
      <StyledBanner>
        <h1>
          <span>Check out </span>
          <span className="highlight">featured stories</span>
        </h1>
        <p>
          Featured stories chosen by our readers and their likes. Theres a story
          for every mood and situation. Make your commute or workout riveting.
          Find something you never thought you needed.
        </p>
        <FeaturedButton onClick={handleScrollTo}>
          Explore Featured
        </FeaturedButton>
      </StyledBanner>
    </div>
  );
}

export default Featured;
