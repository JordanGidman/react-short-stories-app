import styled from "styled-components";
import Button from "./Button";
import { Link } from "react-router-dom";

const StyledCard = styled.li`
  display: flex;
  /* flex-direction: column; */
  height: 35rem;
  font-size: 6.4rem;
  padding: 3rem;
  background-color: ${(props) => props.$backgroundColor};
  box-shadow: 0rem 0.3rem 1rem -1rem rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease-in-out;
  justify-content: flex-${(props) => props.$justify};
  align-items: flex-${(props) => props.$align};
  grid-column: span ${(props) => props.$span};
  color: #1c1f2e;
  font-family: "Playfair Display", serif;
  font-weight: 800;
  /* background-image: url(${(props) => props.$genre.src}); */
  background-image: url(${(props) => props.$backgroundImage});
  background-position: ${(props) =>
    props.$justify === "start" ? "right" : "left"};
  background-size: 50% auto;
  background-repeat: no-repeat;

  background-position: ${(props) => {
    if (
      props.$span === 1 &&
      props.$align === "start" &&
      props.$justify === "end"
    ) {
      return "bottom left";
    } else if (
      props.$span === 1 &&
      props.$align === "end" &&
      props.$justify === "start"
    ) {
      return "top right";
    } else if (
      props.$span === 1 &&
      props.$align === "start" &&
      props.$justify === "start"
    ) {
      return "bottom right";
    }
  }};

  &:hover {
    cursor: pointer;
    box-shadow: 0rem 0.3rem 4rem 0.2rem rgba(0, 0, 0, 0.2);
    scale: 1.02;
  }
  /* 1465px */
  @media (max-width: 91.5em) {
    font-size: 4rem;
  }

  /* 1045px */
  @media (max-width: 65.3em) {
    grid-column: span
      ${(props) => {
        if (props.$genre === "Political" || props.$genre === "Mystery") {
          return 2;
        }
        if (props.$span >= 3) {
          return 2;
        } else {
          return 1;
        }
      }};
  }

  /* 620px */
  @media (max-width: 38.7em) {
    grid-column: span 1;
    height: 25rem;
  }

  /* 390px */
  @media (max-width: 24.3em) {
    font-size: 3rem;
  }
`;

const StyledLink = styled(Link)`
  height: 100%;
  width: 100%;
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

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-${(props) => props.$justify};
  justify-content: flex-${(props) => props.$align};
  text-decoration: none;
  height: 100%;
  width: 100%;
`;

function GenreCard({
  genre,
  span,
  align,
  justify,
  backgroundColor,
  backgroundImage,
}) {
  // function handleClick(e) {
  //   e.preventDefault();

  //   console.log("Click");
  // }

  return (
    <StyledCard
      $genre={genre}
      $span={span}
      $align={align}
      $justify={justify}
      $backgroundColor={backgroundColor}
      $backgroundImage={backgroundImage}
      // onClick={(e) => handleClick(e)}
    >
      <StyledLink to={`${genre.toLowerCase()}`}>
        <StyledWrapper $align={align} $justify={justify}>
          {genre}
          <StyledButton $backgroundColor={backgroundColor}>
            See All
          </StyledButton>
        </StyledWrapper>
      </StyledLink>
    </StyledCard>
  );
}

export default GenreCard;
