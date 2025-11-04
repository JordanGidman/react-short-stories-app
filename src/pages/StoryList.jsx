import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import book from "../img/book.png";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Search from "../components/Search";
import Spinner from "../components/Spinner";

const StyledStoryList = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8.2rem;
  align-items: center;
  width: 100vw;
  gap: 2rem;
  padding: 0% 5%;
  padding-top: 8rem;
  background-color: #f9f9f9;
  min-height: 100vh;

  /* 930px */
  @media (max-width: 58.125em) {
    padding: 0% 2%;
  }
`;

const StyledContainer = styled.div`
  margin-bottom: 3rem;
`;

const StyledH1 = styled.h1`
  font-size: 6.4rem;
  text-align: left;
  padding: 2rem 0rem;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;

  /* 1100px */
  @media (max-width: 68.75em) {
    font-size: 4.8rem;
  }

  /* 710px */
  @media (max-width: 44.375em) {
    font-size: 3.6rem;
  }

  /* 373px */
  @media (max-width: 23.125em) {
    font-size: 3rem;
    text-align: center;
  }
`;

const StyledSubheading = styled.p`
  font-size: 1.6rem;
  padding-bottom: 4rem;
  max-width: 70rem;

  /* 1100px */
  @media (max-width: 68.75em) {
    font-size: 1.6rem;
  }

  /* 710px */
  @media (max-width: 44.375em) {
    font-size: 1.4rem;
  }
`;

const StyledHeader = styled.header`
  padding: 0rem 4rem;
  display: grid;
  grid-template-columns: 40% 60%;
  height: 50vh;
  width: 95vw;
  background-image: url(${book});
  background-color: #fff;
  background-size: 30% auto;
  background-repeat: no-repeat;
  background-position: left 2rem center;

  align-items: center;
  justify-content: space-between;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  margin-bottom: 2rem;

  /* 930px */
  @media (max-width: 58.75em) {
    width: 100vw;
  }

  /* 620px */
  @media (max-width: 38.7em) {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-items: center; */
    text-align: center;
    background-position: center bottom;
    padding-top: 3rem;
  }

  /* 373px */
  @media (max-width: 23.125em) {
    background-image: none;
    justify-content: center;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem 4rem;

  /* 1100px */
  @media (max-width: 68.75em) {
    padding: 1.2rem 0rem;
  }

  /* 620px */
  @media (max-width: 38.7em) {
    align-items: center;
  }
`;

const SearchContainer = styled.div`
  /* 930px */
  @media (max-width: 58.75em) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    padding: 0rem 2rem;
    padding-right: 3rem;
  }
`;

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;

  /* 1200px */
  @media (max-width: 75em) {
    grid-template-columns: 1fr 1fr;
  }

  /* 930px */
  @media (max-width: 58.75em) {
    margin-right: 2rem;
  }

  /* 750px */
  @media (max-width: 47em) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StyledMessage = styled.p`
  font-size: 2rem;
  text-align: center;
  margin-top: 4rem;
  color: #555;
`;

const StyledImg = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem 4rem;

  /* 1100px */
  @media (max-width: 68.75em) {
    padding: 1.2rem 0rem;
  }

  /* 620px */
  @media (max-width: 38.7em) {
    display: none;
  }
`;

function StoryList() {
  const { genre } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const storiesRef = collection(db, "stories");

      // Capitalize genre to match stored format
      const genreName = genre
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const q = query(storiesRef, where("genre", "==", genreName));

      // Real-time listener
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const fetchedStories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStories(fetchedStories);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching stories:", err);
          setError("Failed to load stories. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong while loading stories.");
      setLoading(false);
    }
  }, [genre]);

  // Sorting logic
  const sortedStories = [...stories].sort((a, b) => {
    if (sortBy === "newest") {
      return b.createdAt?.seconds - a.createdAt?.seconds || 0;
    }
    if (sortBy === "oldest") {
      return a.createdAt?.seconds - b.createdAt?.seconds || 0;
    }
    if (sortBy === "mostlikes") {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return 0;
  });

  // Filter + render
  const filteredStories = sortedStories.filter(
    (story) =>
      story.hidden !== true &&
      (story.title?.toLowerCase().includes(search.toLowerCase()) ||
        story.author?.toLowerCase().includes(search.toLowerCase()))
  );

  //Loading state
  if (loading) {
    return (
      <StyledStoryList>
        <Spinner $fullscreen={true} />
      </StyledStoryList>
    );
  }

  //Error state
  if (error) {
    return (
      <StyledStoryList>
        {/* <Navbar /> */}
        <StyledMessage>{error}</StyledMessage>
      </StyledStoryList>
    );
  }

  return (
    <StyledStoryList>
      {/* <Navbar /> */}
      <StyledContainer>
        <StyledHeader>
          <StyledImg />
          <StyledWrapper>
            <StyledH1>{genre}</StyledH1>
            <StyledSubheading>
              Here you can browse all the stories in the {genre} genre that our
              users have created. Feel free to read, like, and share your
              favorites, or create your own story to share with the community.
            </StyledSubheading>
          </StyledWrapper>
        </StyledHeader>

        <SearchContainer>
          <Search
            sortBy={sortBy}
            setSortBy={setSortBy}
            search={search}
            setSearch={setSearch}
          />
        </SearchContainer>

        <StyledList>
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </StyledList>
      </StyledContainer>
    </StyledStoryList>
  );
}

export default StoryList;
