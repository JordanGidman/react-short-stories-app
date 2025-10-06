import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import book from "../img/book.png";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Search from "../components/Search";

const StyledStoryList = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8.2rem;
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
  text-transform: capitalize;
`;
const StyledSubheading = styled.p`
  font-size: 1.6rem;
  padding-bottom: 4rem;
  max-width: 70rem;
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
`;

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem 4rem;
`;

const StyledList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;
`;

function StoryList() {
  //Here we run into a problem, the db has only the test stories i have added. Meaning theres nothing to pull, i have 2 options here i can either fill the db manually or programatically with random stories
  //Or i can use an api, however the only free one i have found returns a random short story that has no genre, so i would have to assign them randomly just to have some sample data.

  //Somehow i didnt know about this tool until now but i will be using faker to fake the data for this
  //I will also need to pull in the results from the DB as i want it all to function normally even if it is just populated by dummy data
  const genre = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("placeholder");
  const sortedStories = [...stories].sort((a, b) => {
    if (sortBy === "newest")
      return b.createdAt.seconds !== a.createdAt.seconds
        ? b.createdAt.seconds - a.createdAt.seconds
        : b.createdAt.nanoseconds - a.createdAt.nanoseconds;
    if (sortBy === "oldest")
      return b.createdAt.seconds !== a.createdAt.seconds
        ? a.createdAt.seconds - b.createdAt.seconds
        : a.createdAt.nanoseconds - b.createdAt.nanoseconds;

    if (sortBy === "mostlikes")
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    return 0;
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storiesRef = collection(db, "stories");

    // Capitalize genre to match stored format
    const genreName = genre.genre
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    console.log("Genre:", genreName);

    const q = query(storiesRef, where("genre", "==", genreName));

    // Subscribe to real-time updates
    const unsub = onSnapshot(q, (docSnap) => {
      const fetchedStories = docSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(fetchedStories);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts or genre changes
    return () => unsub();
  }, [genre]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledStoryList>
      <Navbar />
      <StyledContainer>
        <StyledHeader>
          <StyledWrapper />
          <StyledWrapper>
            <StyledH1>{genre.genre}</StyledH1>
            <StyledSubheading>
              Here you can browse all the stories in the {genre.genre} genre
              that our users have created. Feel free to read, like, and share
              your favorite stories! Aswell as create your own stories to share
              with the community. Happy reading!
            </StyledSubheading>
          </StyledWrapper>
        </StyledHeader>

        <Search
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
        />
        <StyledList>
          {sortedStories
            .filter(
              (story) =>
                (story.hidden !== true &&
                  story.author.toLowerCase().includes(search)) ||
                story.title.toLowerCase().includes(search)
            )
            .map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
        </StyledList>
      </StyledContainer>
    </StyledStoryList>
  );
}

export default StoryList;

//  <Link to="/library">Back to genres</Link>
// {stories.map((story, index) => (
// <StoryCard key={index} story={story} />
// ))}
