import styled from "styled-components";

const StyledCard = styled.li`
  display: flex;
  height: 35rem;
  font-size: 6.4rem;
  padding: 3rem;
  background-color: ${(props) => props.$backgroundColor};
  box-shadow: 0rem 0.3rem 1rem -1rem rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease-in-out;
  justify-content: flex-${(props) => props.$justify};
  align-items: flex-${(props) => props.$align};
  grid-column: span ${(props) => props.$span};
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
`;

function GenreCard({
  genre,
  span,
  align,
  justify,
  backgroundColor,
  backgroundImage,
}) {
  console.log(backgroundImage);

  return (
    <StyledCard
      $genre={genre}
      $span={span}
      $align={align}
      $justify={justify}
      $backgroundColor={backgroundColor}
      $backgroundImage={backgroundImage}
    >
      {genre}
    </StyledCard>
  );
}

export default GenreCard;
