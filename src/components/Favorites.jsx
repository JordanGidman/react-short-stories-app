import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import {
  arrayRemove,
  collection,
  doc,
  documentId,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Search from "./Search";
import Spinner from "./Spinner";
import Error from "../pages/Error"; // assuming this exists
import Navbar from "./Navbar";
import FavoriteStoryItem from "./FavoriteStoryItem";

const StyledFavorites = styled.div`
  min-height: 100%;
  /* min-height: 0; */
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  /* 800px */
  @media (max-width: 50em) {
    flex-direction: column;
  }
`;

const StyledH1 = styled.h1`
  color: rgb(28, 31, 46, 0.8);
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-style: italic;

  /* 800px */
  @media (max-width: 50em) {
    font-size: 2.4rem;
  }
`;

const StyledStoryList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  height: 92%;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  /* overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  } */
`;

function Favorites() {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");

  const [expandedStories, setExpandedStories] = useState(new Set());

  function toggleExpand(storyId) {
    setExpandedStories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) newSet.delete(storyId);
      else newSet.add(storyId);
      return newSet;
    });
  }

  // Derived sorted stories
  const sortedStories = useMemo(() => {
    return [...stories].sort((a, b) => {
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
  }, [stories, sortBy]);

  // Load user's favorites
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    const favRef = doc(db, "users", currentUser.uid);

    const unsub = onSnapshot(
      favRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFavorites(data.favorites || []);
          setError(null);
        } else {
          setError(new Error("User not found"));
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching favorites:", err);
        setError(err);
        setLoading(false);
        toast.error("Could not load favorites.");
      }
    );

    return () => unsub();
  }, [currentUser.uid]);

  // Load stories by favorite IDs
  useEffect(() => {
    if (!favorites?.length) {
      setStories([]);
      return;
    }

    setDataLoading(true);
    const storiesRef = collection(db, "stories");
    const q = query(storiesRef, where(documentId(), "in", favorites));

    const unsub = onSnapshot(
      q,
      (docSnap) => {
        setStories(docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setDataLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error loading stories:", err);
        setError(err);
        setDataLoading(false);
        toast.error("Could not load favorite stories.");
      }
    );

    return () => unsub();
  }, [favorites]);

  if (loading)
    return (
      <>
        <Navbar />
        <Spinner $height={"calc(100vh - 8rem)"} />
      </>
    );
  if (error) return <Error error={error} />;

  return (
    <StyledFavorites>
      <StyledHead>
        <StyledH1>Favorites</StyledH1>
        <Search
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
        />
      </StyledHead>

      {dataLoading ? (
        <Spinner $height={"100%"} />
      ) : (
        <StyledStoryList>
          {sortedStories
            ?.filter(
              (story) =>
                (story.hidden !== true &&
                  story.author.toLowerCase().includes(search)) ||
                story.title.toLowerCase().includes(search)
            )
            .map((story) => (
              <FavoriteStoryItem
                key={story.id}
                story={story}
                isExpanded={expandedStories.has(story.id)}
                toggleExpand={() => toggleExpand(story.id)}
              />
            ))}
        </StyledStoryList>
      )}
    </StyledFavorites>
  );
}

export default Favorites;
