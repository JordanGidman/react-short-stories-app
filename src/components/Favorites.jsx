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
import Button from "./Button";

const StyledFavorites = styled.div`
  height: 100%;
`;

const StyledH1 = styled.h1`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(28, 31, 46, 0.8);
  padding-bottom: 2rem;
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
  /* background-color: #fff; */
  width: 100%;
  min-height: 100vh;

  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  overflow-y: scroll;
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

// Tooltip text
const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;

  position: absolute;
  bottom: 125%; /* show above button */
  left: 50%;
  transform: translateX(-50%);

  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  white-space: nowrap;

  z-index: 1;

  /* arrow, ill be honest i took this from the internet, thank you random person */
  &::after {
    content: "";
    position: absolute;
    top: 100%; /* point downwards */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${StyledButton}:hover & {
    visibility: visible;
    opacity: 1;
    .icon {
      font-size: 2.4rem;
    }
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
  //Pull story data using ids
  //Display data in a list similar to my stories but with the only button being to unfavorite or view
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(null);
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(favorites);
  console.log(stories);

  //Pull favorite id's from user
  useEffect(() => {
    if (!currentUser?.uid) return;

    const favRef = doc(db, "users", currentUser?.uid);

    const unsub = onSnapshot(favRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setFavorites(data.favorites);
      } else {
        console.log("No favorites");
      }
    });

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!favorites?.length) return;

    const storiesRef = collection(db, "stories");

    const q = query(storiesRef, where(documentId(), "in", favorites));

    const unsub = onSnapshot(q, (docSnap) => {
      setStories(
        docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [favorites]);

  async function handleUnfavorite(id) {
    console.log(id);

    await updateDoc(doc(db, "users", currentUser?.uid), {
      favorites: arrayRemove(id),
    });
  }

  return (
    <StyledFavorites>
      <StyledH1>Favorites</StyledH1>
      <StyledStoryList>
        {loading ? (
          <div>Loading...</div>
        ) : (
          stories?.map((story) => (
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
                  disabled={loading}
                  onClick={() => {
                    navigate(`/library/${story.genre}/book/${story.id}`);
                  }}
                >
                  <ion-icon
                    className="icon icon-open"
                    name="open-outline"
                  ></ion-icon>
                  <Tooltip>Read</Tooltip>
                </StyledButton>
                <StyledButton
                  disabled={loading}
                  onClick={() => {
                    handleUnfavorite(story.id);
                  }}
                >
                  <ion-icon className="icon icon-star" name="star"></ion-icon>
                  <Tooltip>Remove from favorites</Tooltip>
                </StyledButton>
              </StyledButtons>
            </StyledListItem>
          ))
        )}
      </StyledStoryList>
    </StyledFavorites>
  );
}

export default Favorites;
