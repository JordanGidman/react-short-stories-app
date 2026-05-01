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
import FollowedCard from "./FollwedCard";

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
`;

function FollowedList() {
  const { currentUser } = useContext(AuthContext);
  const [followed, setFollowed] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");

  // function toggleExpand(storyId) {
  //   setExpandedStories((prev) => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(storyId)) newSet.delete(storyId);
  //     else newSet.add(storyId);
  //     return newSet;
  //   });
  // }

  // // Derived sorted stories
  // const sortedStories = useMemo(() => {
  //   return [...stories].sort((a, b) => {
  //     if (sortBy === "newest")
  //       return b.createdAt.seconds !== a.createdAt.seconds
  //         ? b.createdAt.seconds - a.createdAt.seconds
  //         : b.createdAt.nanoseconds - a.createdAt.nanoseconds;

  //     if (sortBy === "oldest")
  //       return b.createdAt.seconds !== a.createdAt.seconds
  //         ? a.createdAt.seconds - b.createdAt.seconds
  //         : a.createdAt.nanoseconds - b.createdAt.nanoseconds;

  //     if (sortBy === "mostlikes")
  //       return (b.likes?.length || 0) - (a.likes?.length || 0);

  //     if (sortBy === "leastlikes")
  //       return (a.likes?.length || 0) - (b.likes?.length || 0);

  //     return 0;
  //   });
  // }, [stories, sortBy]);

  // Load user's followed authors
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    const followeRef = doc(db, "users", currentUser.uid);

    const unsub = onSnapshot(
      followeRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFollowed(data.followed || []);
          setError(null);
        } else {
          setError(new Error("User not found"));
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching followed authors:", err);
        setError(err);
        setLoading(false);
        toast.error("Could not load followed authors.");
      },
    );

    return () => unsub();
  }, [currentUser.uid]);

  //Fetch the author info for the followed authors
  useEffect(() => {
    if (!followed?.length) return;
    setDataLoading(true);

    const authorsRef = collection(db, "users");
    const q = query(authorsRef, where("uid", "in", followed));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const fetchedAuthors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAuthors(fetchedAuthors);
      console.log(fetchedAuthors);

      setDataLoading(false);
    });

    return () => unsub();
  }, [followed]);

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
        <StyledH1>Followed</StyledH1>
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
          {authors?.map((author) => (
            <FollowedCard key={author.id} author={author} />
          ))}
        </StyledStoryList>
      )}
    </StyledFavorites>
  );
}

export default FollowedList;
