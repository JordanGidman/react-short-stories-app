import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import {
  arrayRemove,
  collection,
  doc,
  documentId,
  getDoc,
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

const StyledDrafts = styled.div`
  min-height: 100%;
  min-height: 0;
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

const StyledListItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;

  /* 930px */
  @media (max-width: 58.125em) {
    grid-template-columns: repeat(3, 1fr);
    row-gap: ${(props) => (props.$expanded ? "3rem" : "0rem")};
    justify-items: center;
    padding-right: 4rem;
  }

  /* 525px */
  @media (max-width: 32.81em) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 0rem;
  }
`;

const StyledItemText = styled.p`
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
  overflow: hidden;

  @media (max-width: 58.125em) {
    max-height: ${(props) => (props.$expanded ? "200px" : "0px")};
    opacity: ${(props) => (props.$expanded ? 1 : 0)};
    visibility: ${(props) => (props.$expanded ? "visible" : "hidden")};
  }

  /* 525px */
  @media (max-width: 32.81em) {
    font-size: 1.4rem;
  }
`;

const StyledTitle = styled.p`
  transition: all 0.3s ease-in-out;
  text-transform: capitalize;

  /* 930px */
  @media (max-width: 58.125em) {
    grid-column: span 2;
  }

  /* 525px */
  @media (max-width: 32.81em) {
    /* font-size: 1.4rem; */
  }
`;

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  /* 930px */
  @media (max-width: 58.125em) {
    /* display: grid;
    grid-template-columns: repeat(3, 1fr); */
    grid-column: 3/4;
    width: 100%;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
    max-height: ${(props) => (props.$expanded ? "100px" : "0px")};
    opacity: ${(props) => (props.$expanded ? 1 : 0)};
    visibility: ${(props) => (props.$expanded ? "visible" : "hidden")};
  }
`;

const StyledButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  .icon {
    font-size: 2.4rem;
  }

  .icon-delete {
    transition: all 0.3s ease-in-out;
    &:hover {
      color: red;
    }
  }

  &:hover {
    cursor: pointer;
    color: #ffbe0b;
  }

  /* 930px */
  @media (max-width: 58.125em) {
    width: 100%;
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

const StyledExpandButton = styled.button`
  display: none;
  border: none;
  background: none;
  font-size: 2rem;
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:hover {
    cursor: pointer;
  }

  /* 930px */
  @media (max-width: 58.125em) {
    display: inline-block;
  }

  /* 400px */
  @media (max-width: 25em) {
    right: 2rem;
  }
`;

const StyledImg = styled.div`
  width: 15rem;
  height: 8rem;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
`;

function Drafts() {
  const { currentUser } = useContext(AuthContext);
  const [drafts, setDrafts] = useState([]);
  // const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("placeholder");
  const [search, setSearch] = useState("");
  const [expandedStories, setExpandedStories] = useState(new Set());
  const navigate = useNavigate();

  // Derived sorted stories
  const sortedStories = [...drafts].sort((a, b) => {
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

  // Load user's drafts
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    const draftsRef = doc(db, "users", currentUser.uid);

    const unsub = onSnapshot(
      draftsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDrafts(data.drafts || []);
          setError(null);
        } else {
          setError(new Error("User not found"));
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching drafts:", err);
        setError(err);
        setLoading(false);
        toast.error("Could not load drafts.");
      }
    );

    return () => unsub();
  }, [currentUser]);

  async function handleDelete(draftId) {
    //delete the draft
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedDrafts = (userData.drafts || []).filter(
        (draft) => draft.draftId !== draftId
      );

      await updateDoc(userRef, { drafts: updatedDrafts });
      toast.success("Draft deleted");
    }
  }

  function toggleExpandStory(storyId) {
    setExpandedStories((prevExpandedStories) => {
      const newExpandedStories = new Set(prevExpandedStories);
      if (newExpandedStories.has(storyId)) newExpandedStories.delete(storyId);
      else newExpandedStories.add(storyId);
      return newExpandedStories;
    });
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
    <StyledDrafts>
      <StyledHead>
        <StyledH1>Drafts</StyledH1>
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
                  story.author?.toLowerCase().includes(search)) ||
                story.title?.toLowerCase().includes(search)
            )
            .map((story, i) => (
              <StyledListItem
                key={story.id || i}
                $expanded={expandedStories.has(story.id)}
              >
                <StyledImg $backgroundImage={story.img} alt={story.title} />
                <StyledTitle>{story.title || "Untitled"}</StyledTitle>
                <StyledExpandButton onClick={() => toggleExpandStory(story.id)}>
                  {expandedStories.has(story.id) ? "−" : "+"}
                </StyledExpandButton>
                <StyledItemText $expanded={expandedStories.has(story.id)}>
                  {story.genre || "No Genre"}
                </StyledItemText>
                <StyledItemText $expanded={expandedStories.has(story.id)}>
                  Created:{" "}
                  {new Date(story.createdAt?.seconds * 1000).toLocaleDateString(
                    "en-US"
                  )}
                </StyledItemText>

                <StyledButtons $expanded={expandedStories.has(story.id)}>
                  <StyledButton
                    onClick={() =>
                      navigate(`/edit/${story.draftId}`, { state: { story } })
                    }
                  >
                    <ion-icon
                      className="icon icon-edit"
                      name="create-outline"
                    ></ion-icon>
                    <Tooltip>Edit</Tooltip>
                  </StyledButton>

                  <StyledButton onClick={() => handleDelete(story.draftId)}>
                    <ion-icon
                      name="trash-outline"
                      className="icon icon-delete"
                    ></ion-icon>
                    <Tooltip>Delete draft</Tooltip>
                  </StyledButton>
                </StyledButtons>
              </StyledListItem>
            ))}
        </StyledStoryList>
      )}
    </StyledDrafts>
  );
}

export default Drafts;
