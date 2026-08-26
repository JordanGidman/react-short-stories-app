import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import styled from "styled-components";
import book from "../img/book.webp";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import { createNavigation } from "../helpers/createNavigation";

const PAGE_SIZE = 15;

const StyledStoryList = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8.2rem;
  align-items: center;
  /* width: 100vw; */
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
    padding-top: 0rem;
    /* width: 100vw; */
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

  /* 620px */
  @media (max-width: 38.7em) {
    text-align: center;
  }
`;

const StyledImgWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${book});
  /* background-color: #fff; */
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;

  /* 620px */
  @media (max-width: 38.7em) {
    background-size: 60% auto;
  }
`;

const StyledHeader = styled.header`
  padding: 0rem 4rem;
  display: grid;
  grid-template-columns: 40% 60%;
  height: 50vh;
  width: 95vw;
  background-color: #fff;
  /* background-image: url(${book});
  background-color: #fff;
  background-size: 30% auto;
  background-repeat: no-repeat;
  background-position: left 2rem center; */
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
    /* display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-position: center bottom;
    padding-top: 3rem; */
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 0rem 3rem 0rem 3rem;
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

  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }

  /* 930px */
  @media (max-width: 58.125em) {
  }
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  margin-top: 3rem;
`;

function StoryList() {
  const { genre } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const firstDocRef = useRef(null);
  const lastDocRef = useRef(null);
  const currentPageRef = useRef(1);

  //Capitalize genre to match stored format
  const genreName = genre
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fetchStories = useCallback(
    async (direction = "initial") => {
      setLoading(true);
      setError(null);

      try {
        const storiesRef = collection(db, "stories");

        // Base query - genre + hidden
        const baseQuery = query(
          storiesRef,
          where("genres", "array-contains", genreName),
          // where("genres", "array-contains", genreName),
          where("hidden", "==", false),
        );

        // Sorting
        let q;

        if (sortBy === "newest") {
          q = query(baseQuery, orderBy("createdAt", "desc"));
        } else if (sortBy === "oldest") {
          q = query(baseQuery, orderBy("createdAt", "asc"));
        } else if (sortBy === "mostlikes") {
          q = query(baseQuery, orderBy("likesCount", "desc"));
        } else if (sortBy === "leastlikes") {
          q = query(baseQuery, orderBy("likesCount", "asc"));
        } else {
          q = query(baseQuery, orderBy("createdAt", "desc"));
        }

        // Get total count
        const countSnapshot = await getCountFromServer(baseQuery);
        const total = countSnapshot.data().count;
        const calculatedTotalPages = Math.ceil(total / PAGE_SIZE);

        setTotalDocs(total);
        setTotalPages(calculatedTotalPages);

        // Determine target page
        let targetPage;

        if (direction === "next") {
          targetPage = currentPageRef.current + 1;
        } else if (direction === "previous") {
          targetPage = currentPageRef.current - 1;
        } else {
          targetPage = 1;
        }

        // Don't fetch outside valid page range
        if (targetPage < 1 || targetPage > calculatedTotalPages) {
          return;
        }

        // Pagination query
        if (direction === "next") {
          q = query(q, startAfter(lastDocRef.current), limit(PAGE_SIZE));
        } else if (direction === "previous") {
          q = query(q, endBefore(firstDocRef.current), limitToLast(PAGE_SIZE));
        } else {
          q = query(q, limit(PAGE_SIZE));
        }

        const snapshot = await getDocs(q);

        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Store cursors
        firstDocRef.current = snapshot.docs[0] ?? null;
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;

        // Store current page
        currentPageRef.current = targetPage;
        setCurrentPage(targetPage);

        setStories(fetched);
        //Check if there are more pages to fetch
        setHasMore(targetPage < calculatedTotalPages);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [genreName, sortBy],
  );

  console.log(stories);
  // Fetch first page when genre or sort changes
  useEffect(() => {
    setStories([]);

    currentPageRef.current = 1;
    firstDocRef.current = null;
    lastDocRef.current = null;

    setCurrentPage(1);
    setHasMore(true);

    fetchStories("initial");
  }, [fetchStories]);

  // Apply client-side search (server handles filtering/sorting)
  const filteredStories = stories.filter(
    (story) =>
      story.title?.toLowerCase().includes(search.toLowerCase()) ||
      story.author?.toLowerCase().includes(search.toLowerCase()),
  );
  // const navigation = useMemo(
  //   () => ({
  //     type: "genre",
  //     storyInfo: filteredStories.map((s, i) => {
  //       return {
  //         storyId: s.id,
  //         title: s.title,
  //         index: i,
  //       };
  //     }),
  //   }),
  //   [filteredStories],
  // );

  const navigation = createNavigation(filteredStories, "genre");

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
          {/* <div /> */}
          <StyledImgWrapper />
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
            <StoryCard key={story.id} story={story} navigation={navigation} />
          ))}
        </StyledList>

        {/* {hasMore && !loading && (
          <LoadMoreButton onClick={() => fetchStories(false)}>
            Next Page
          </LoadMoreButton>
        )} */}
        {totalPages > 1 && (
          <PageNavigation>
            <LoadMoreButton
              disabled={currentPage === 1 || loading}
              onClick={() => fetchStories("previous")}
            >
              Previous Page
            </LoadMoreButton>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <LoadMoreButton
              disabled={currentPage === totalPages || loading}
              onClick={() => fetchStories("next")}
            >
              Next Page
            </LoadMoreButton>
          </PageNavigation>
        )}

        {/* {loading && stories.length > 0 && <Spinner />} */}
      </StyledContainer>
    </StyledStoryList>
  );
}

export default StoryList;
