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
  /* margin-bottom: 3rem; */
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
`;

const StyledSorting = styled.div`
  display: flex;
  padding: 2rem 0rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-right: 2rem;

  .icon {
    font-size: 2.4rem;
    color: #1c1f2e;
  }
`;

const StyledSearchBar = styled.input`
  font-size: 1.6rem;
  border-radius: 1.6rem;
  /* width: 50%; */
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  text-transform: capitalize;
  font-style: italic;
  color: #1c1f2e;
`;

const StyledSelect = styled.select`
  font-size: 1.6rem;
  border-radius: 1.6rem;
  width: 20rem;
  padding: 1rem 2rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  text-transform: capitalize;
  font-style: italic;
  color: #1c1f2e;

  &[data-chosen-placeholder] {
    color: rgb(0, 0, 0, 0.5);
  }
`;

const StyledOption = styled.option`
  color: #1c1f2e;
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

  // useEffect(() => {
  //   if (!sortBy || stories.length === 0) return;

  //   const sorted = [...stories].sort((a, b) => {
  //     if (sortBy === "newest") return a.createdAt.seconds - b.createdAt.seconds;
  //     if (sortBy === "oldest") {
  //       if (a.createdAt.seconds === b.createdAt.seconds) {
  //         return a.createdAt.nanoseconds - b.createdAt.nanoseconds;
  //       }
  //       return a.createdAt.seconds - b.createdAt.seconds;
  //     }
  //     if (sortBy === "mostlikes")
  //       return (a.likes?.length || 0) - (b.likes?.length || 0);
  //     return 0;
  //   });

  //   setStories(sorted);
  // }, [sortBy, stories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // function validateImage(url) {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.onload = () => resolve(url);
  //     img.onerror = () =>
  //       resolve(
  //         faker.image.urlPicsumPhotos({
  //           category: "animals",
  //           blur: 0,
  //         })
  //       );
  //     img.src = url;
  //   });
  // }

  // useEffect(() => {
  //   async function createRandomStories() {
  //     const randomStories = await Promise.all(
  //       Array.from({ length: 20 }, async () => {
  //         const fakerUrl = faker.image.urlLoremFlickr({ category: "book" });
  //         const validUrl = await validateImage(fakerUrl);

  //         return {
  //           id: faker.string.uuid(),
  //           title: faker.word.words({ length: { min: 2, max: 5 } }),
  //           author: faker.person.fullName(),
  //           storyText: faker.lorem.paragraphs(),
  //           synopsis: faker.lorem.sentences(2),
  //           genre: genre.genre,
  //           img: validUrl, // always valid
  //         };
  //       })
  //     );

  //     setStories(randomStories);
  //     setLoading(false);
  //   }

  //   createRandomStories();
  // }, [genre]);

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
        <StyledSorting>
          <StyledSearch>
            <ion-icon name="search-outline" className="icon"></ion-icon>
            <StyledSearchBar
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Type a title or author here... (To test it just type test story or anti in the fantasy genre.)"
            />
          </StyledSearch>
          <StyledSelect
            onChange={(e) => setSortBy(e.target.value)}
            name="sortby"
            disabled={loading}
            value={sortBy}
          >
            <StyledOption
              disabled
              hidden
              name="placeholder"
              value="placeholder"
            >
              Sort By
            </StyledOption>
            <StyledOption value="oldest">Oldest</StyledOption>
            <StyledOption value="newest">Newest</StyledOption>
            <StyledOption value="mostlikes">Most likes</StyledOption>
          </StyledSelect>
        </StyledSorting>
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
