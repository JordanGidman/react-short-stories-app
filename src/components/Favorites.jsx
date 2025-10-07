import { useContext, useEffect, useState } from "react";
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

const StyledFavorites = styled.div`
  height: 100%;
  min-height: 0;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const StyledH1 = styled.h1`
  color: rgb(28, 31, 46, 0.8);
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-style: italic;
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
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;
`;

const StyledItemText = styled.p``;

const StyledTitle = styled(Link)`
  transition: all 0.3s ease-in-out;
  text-transform: capitalize;

  &:hover {
    text-decoration: underline;
    color: #ffbe0b;
  }
`;

const StyledButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  .icon {
    font-size: 2.4rem;
    color: #ffbe0b;
  }

  .icon-open {
    color: #000;
  }

  &:hover {
    cursor: pointer;
    color: #ffbe0b;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  white-space: nowrap;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${StyledButton}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const StyledImg = styled.div`
  width: 15rem;
  height: 8rem;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
`;

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
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
  const navigate = useNavigate();

  // Derived sorted stories
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
  }, [currentUser]);

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

  async function handleUnfavorite(id) {
    try {
      await updateDoc(doc(db, "users", currentUser?.uid), {
        favorites: arrayRemove(id),
      });
      toast.success("Removed story from favorites");
    } catch (error) {
      console.error(error);
      toast.error("Unfavorite failed. Please try again later");
    }
  }

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
              <StyledListItem key={story.id}>
                <StyledImg $backgroundImage={story.img} alt={story.title} />
                <StyledTitle
                  to={`/library/${story.genre.split("-").join(" ")}/book/${
                    story.id
                  }`}
                >
                  {story.title}
                </StyledTitle>
                <StyledItemText>{story.genre}</StyledItemText>
                <StyledButtons>
                  <StyledButton
                    onClick={() =>
                      navigate(`/library/${story.genre}/book/${story.id}`)
                    }
                  >
                    <ion-icon
                      class="icon icon-open"
                      name="open-outline"
                    ></ion-icon>
                    <Tooltip>Read</Tooltip>
                  </StyledButton>

                  <StyledButton onClick={() => handleUnfavorite(story.id)}>
                    <ion-icon class="icon icon-star" name="star"></ion-icon>
                    <Tooltip>Remove from favorites</Tooltip>
                  </StyledButton>
                </StyledButtons>
              </StyledListItem>
            ))}
        </StyledStoryList>
      )}
    </StyledFavorites>
  );
}

export default Favorites;
