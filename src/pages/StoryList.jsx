import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import styled from "styled-components";
import book from "../img/book.png";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Search from "../components/Search";
import Spinner from "../components/Spinner";

const PAGE_SIZE = 15;

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

  @media (max-width: 58.125em) {
    padding: 2rem;
    width: 100vw;
  }
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

  /* 370px */
  @media (max-width: 23.125em) {
    font-size: 3rem;
    text-align: center;
  }
`;

const StyledSubheading = styled.p`
  font-size: 1.6rem;
  padding-bottom: 4rem;
  max-width: 70rem;

  /* 1100 */
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
  @media (max-width: 58.125em) {
    width: 100vw;
  }

  /* 620px */
  @media (max-width: 38.7em) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-position: center bottom;
    padding-top: 3rem;
  }

  /* 370px */
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
  @media (max-width: 58.125em) {
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

const LoadMoreButton = styled.button`
  background-color: #1c1f2e;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  font-weight: 600;
  border-radius: 0.5rem;
  margin-top: 3rem;
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }

  /* 930px */
  @media (max-width: 58.125em) {
  }
`;

function StoryList() {
  const { genre } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const lastDocRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  //Capitalize genre to match stored format
  const genreName = genre
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fetchStories = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);

      try {
        const storiesRef = collection(db, "stories");

        // Base query - genre + hidden
        let baseQuery = query(
          storiesRef,
          where("genre", "==", genreName),
          where("hidden", "==", false)
        );

        // Sorting
        let q;
        if (sortBy === "newest")
          q = query(baseQuery, orderBy("createdAt", "desc"));
        else if (sortBy === "oldest")
          q = query(baseQuery, orderBy("createdAt", "asc"));
        else if (sortBy === "mostlikes")
          q = query(baseQuery, orderBy("likesCount", "desc"));
        else q = query(baseQuery, orderBy("createdAt", "desc"));

        // Pagination - fetch one extra doc to check if more exist
        const fetchLimit = PAGE_SIZE + 1;

        if (!reset && lastDocRef.current) {
          q = query(q, startAfter(lastDocRef.current), limit(fetchLimit));
        } else {
          q = query(q, limit(fetchLimit));
        }

        const snapshot = await getDocs(q);

        // Check if there is another page
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        const hasNextPage = fetched.length > PAGE_SIZE;

        // Slice off the extra doc if it exists
        const pageStories = hasNextPage ? fetched.slice(0, PAGE_SIZE) : fetched;

        // Update lastDoc for next pagination
        const last = snapshot.docs[pageStories.length - 1] ?? null;
        lastDocRef.current = last;

        // Update state
        setStories((prev) => (reset ? pageStories : [...prev, ...pageStories]));
        setHasMore(hasNextPage);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [genreName, sortBy]
  );

  // Fetch first page when genre or sort changes
  useEffect(() => {
    setStories([]);
    setLastDoc(null);
    lastDocRef.current = null;
    setHasMore(true);
    fetchStories(true);
  }, [fetchStories]);

  // Apply client-side search (server handles filtering/sorting)
  const filteredStories = stories.filter(
    (story) =>
      story.title?.toLowerCase().includes(search.toLowerCase()) ||
      story.author?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && stories.length === 0) {
    return (
      <StyledStoryList>
        <Spinner $fullscreen={true} />
      </StyledStoryList>
    );
  }

  if (error) {
    return (
      <StyledStoryList>
        <StyledMessage>{error}</StyledMessage>
      </StyledStoryList>
    );
  }

  return (
    <StyledStoryList>
      <StyledContainer>
        <StyledHeader>
          <div />
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

        {hasMore && !loading && (
          <LoadMoreButton onClick={() => fetchStories(false)}>
            Load More
          </LoadMoreButton>
        )}

        {loading && stories.length > 0 && <Spinner />}
      </StyledContainer>
    </StyledStoryList>
  );
}

export default StoryList;
