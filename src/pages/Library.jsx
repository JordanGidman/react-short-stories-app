import styled from "styled-components";
import Navbar from "../components/Navbar";
import GenreCard from "../components/GenreCard";
//image imports
import comedy from "../img/comedy.png";
import existential from "../img/existential.webp";
import romance from "../img/romance.webp";
import historical from "../img/historical.webp";
import mystery from "../img/mystery.webp";
import drama from "../img/drama.webp";
import religious from "../img/religious.webp";
import { Outlet } from "react-router-dom";

// Styled components
const StyledLibrary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  width: 100vw;
  gap: 2rem;
  padding: 0% 5%;
  padding-top: 8rem;
  background-color: #f9f9f9;

  min-height: 100vh;
`;

const StyledContainer = styled.div`
  margin-bottom: 3rem;
`;
const StyledH1 = styled.h1`
  font-size: 6.4rem;
  text-align: left;
  padding: 2rem 0rem;
  font-family: "Playfair Display", serif;
`;
const StyledSubheading = styled.p`
  font-size: 1.8rem;
  padding-bottom: 4rem;
`;
const StyledGenreList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  list-style: none;
  align-items: stretch;
  justify-content: space-between;

  padding: 1.4rem 2rem;
  border-radius: 1.6rem;

  min-height: 100vh;
  width: 95vw;
  row-gap: 4rem;
  column-gap: 2rem;
`;

const StyledHeader = styled.header`
  padding: 0rem 4rem;
  display: grid;
  grid-template-columns: 40% 60%;
  height: 60vh;
  width: 95vw;
  background-image: url(${religious});
  background-color: #fff;
  background-size: 40% auto;
  background-repeat: no-repeat;
  background-position: left 2rem center;

  align-items: center;
  justify-content: space-between;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  margin-bottom: 3rem;
`;

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem 4rem;
`;

function Library() {
  const genres = [
    "Fantasy",
    "Thriller",
    "Gaming",
    "Horror",
    "Mystery",
    "Historical",
    "Comedy",
    "Crime",
    "Adventure",
    "Action",
    "Religious",
    "Political",
    "Existential",
    "War",
    "Drama",
    "Science Fiction",
    "Romance",
    "Educational",
    "Other",
  ];

  //I could do this randomly with Math.random but i have a specific layout in mind and this is just easier
  const spans = [1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 2, 2, 4];
  const aligns = [
    { align: "end", justify: "end" },
    { align: "start", justify: "end" },
    { align: "end", justify: "start" },
    { align: "start", justify: "end" },
    { align: "start", justify: "end" },
    { align: "end", justify: "start" },
    { align: "end", justify: "end" },
    { align: "start", justify: "end" },

    { align: "end", justify: "start" },
    { align: "start", justify: "start" },
    { align: "end", justify: "start" },
    { align: "start", justify: "start" },
    { align: "end", justify: "end" },
    { align: "start", justify: "end" },
    { align: "start", justify: "start" },
    { align: "end", justify: "end" },
    { align: "end", justify: "start" },
    { align: "start", justify: "start" },
    { align: "start", justify: "start" },
  ];
  const genreImages = {
    comedy,
    existential,
    romance,
    historical,
    mystery,
    drama,
  };

  // function getAlign(i) {
  //   const col = i % 4;
  //   const isTop = col % 2 === 0; // alternate per column
  //   const isRight = Math.random() > 0.5;

  //   return {
  //     justify: isTop ? "flex-start" : "flex-end", // top or bottom
  //     align: isRight ? "flex-end" : "flex-start", // random left or right
  //   };
  // }

  //Problems to solve
  //I will likely need to use an API for importing some stories as otherwise i would have to write a bunch myself to actually have some data
  //The issue is that i want user generated posts to be lumped in as well so i will need to likely combine them
  //I will need to pull stories based on genre
  //I will likely also need a search function

  return (
    <StyledLibrary>
      <Navbar />
      <StyledContainer>
        <StyledHeader>
          <StyledWrapper />
          <StyledWrapper>
            <StyledH1>Browse by Genre</StyledH1>
            <StyledSubheading>
              A vast, user-made library of short stories, bringing you titles
              from around the world, featuring short stories of all genres. No
              matter what you are feeling theres something for everyone. So
              choose your genre and get stuck in to your literary adventure.
            </StyledSubheading>
          </StyledWrapper>
        </StyledHeader>
        <StyledGenreList>
          {genres.map((genre, i) => {
            // const { align, justify } = getAlign(i);

            let bgColor = "#fff";

            const image = genreImages[genre.toLowerCase()];

            if (i === 2 || i === 10) bgColor = "#ffee34";
            if (
              i === 3 ||
              i === 4 ||
              i === 7 ||
              i === 8 ||
              i === 13 ||
              i === 14 ||
              i === 17
            )
              bgColor = "#85e9e1";

            return (
              <GenreCard
                genre={genre}
                span={spans[i]}
                align={aligns[i].align}
                justify={aligns[i].justify}
                backgroundColor={bgColor}
                key={i}
                backgroundImage={image}
              />
            );
          })}
        </StyledGenreList>
      </StyledContainer>

      {/* <Outlet /> */}
    </StyledLibrary>
  );
}

export default Library;
