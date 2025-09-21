import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import styled from "styled-components";
import mystories from "../img/mystories.jpg";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//Just realizing i likely want this to just be a component on the account page rather than its own page. But thats tomorrows problem. Likely this will be moved to the accounts page later on.

const StyledMyStories = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  width: 100vw;
  gap: 2rem;
  padding: 0% 5%;
  padding-top: 8rem;
  background-color: #f9f9f9;

  min-height: 100vh;
`;

const StyledHeader = styled.header`
  padding: 0rem 4rem;
  display: grid;
  grid-template-columns: 40% 60%;
  height: 50vh;
  width: 95vw;
  background-image: url(${mystories});
  background-color: #fff;
  background-size: 30% auto;
  background-repeat: no-repeat;
  background-position: left 2rem center;

  align-items: center;
  justify-content: space-between;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  margin-bottom: 3rem;
`;

const StyledH1 = styled.h1`
  font-size: 6.4rem;
  text-align: left;
  padding: 2rem 0rem;
  font-family: "Playfair Display", serif;
`;
const StyledSubheading = styled.p`
  font-size: 1.8rem;
  padding-bottom: 4rem;
`;

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem 4rem;
`;

const StyledStoryList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  background-color: #fff;
  width: 95vw;
  min-height: 100vh;

  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
`;

const StyledListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid #eee;
  width: 100%;
  padding: 2rem 4rem;
`;

const StyledItemText = styled.p``;

const StyledTitle = styled(Link)`
  transition: all 0.3s ease-in-out;

  &:hover {
    text-decoration: underline;
    color: #ffbe0b;
  }
`;

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  grid-column: 6 / -1;
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
    &:hover {
      color: #ff0000;
    }
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

  /* arrow */
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

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding: 3rem;
  gap: 4rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-color: #1c1f2e;
  color: #fff;
  width: 50vw;
  height: 30vh;
  font-size: 2rem;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  border-radius: 1.2rem;
  z-index: 1000;
`;

const StyledModal = styled.div`
  display: ${(props) => (props.$modalOpen ? "flex" : "none")};
  height: 100vh;
  width: 100vw;
  position: fixed;
  backdrop-filter: blur(4px);
`;

const StyledModalButton = styled(Button)``;

function MyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  //Did not know this was even an option. I have been using a context for this so i will continue to do so for consistency but will use the below in future projects.
  // const currentUser = auth.currentUser;

  console.log(stories);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      const storiesRef = collection(db, "stories");

      const q = query(storiesRef, where("creatorID", "==", currentUser.uid));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

      const fetchedStories = querySnapshot.docs
        .sort((a, b) => {
          return b.data().createdAt - a.data().createdAt;
        })
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setStories(fetchedStories);
      setLoading(false);
    }

    fetchStories();
  }, [currentUser]);

  function handleEdit(story) {
    // Logic to handle editing the story
    //Open the edit story page with the fields filled with the story data
    //will need to check on the edit story page if it is posting a new story or editing an existing one
    navigate(`/edit/${story.id}`, { state: { story } });
  }

  async function handleTogglePrivacy(storyId) {
    // Logic to handle toggling the story's privacy
    setLoading(true);
    try {
      //Get the relevant story from firebase
      const story = stories.find((story) => story.id === storyId);
      const storyRef = doc(db, "stories", storyId);
      console.log(storyRef);

      //Change it in the stories state as well to force a re-render
      setStories((prevStories) =>
        prevStories.map((s) =>
          s.id === storyId ? { ...s, hidden: !s.hidden } : s
        )
      );

      await updateDoc(storyRef, {
        hidden: !story.hidden,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(storyId) {
    // Logic to handle deleting the story
    setLoading(true);
    try {
      await deleteDoc(doc(db, "stories", storyId));
      //Also want to remove the story from the stories state to force a re-render
      setStories((prevStories) =>
        prevStories.filter((story) => story.id !== storyId)
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyledMyStories>
      <Navbar />
      <StyledHeader>
        <StyledWrapper />
        <StyledWrapper>
          <StyledH1>My Stories</StyledH1>
          <StyledSubheading>
            Here are your stories. You can edit, delete, or read them all from
            here.
          </StyledSubheading>
        </StyledWrapper>
      </StyledHeader>

      <StyledStoryList>
        {loading ? (
          <div>Loading...</div>
        ) : (
          stories.map((story) => (
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
              <StyledItemText>
                Created:{" "}
                {new Date(story.createdAt?.seconds * 1000).toLocaleDateString(
                  "en-US"
                )}
              </StyledItemText>
              {story.editedAt && (
                <StyledItemText>
                  Edited:{" "}
                  {new Date(story.editedAt?.seconds * 1000).toLocaleDateString(
                    "en-US"
                  )}
                </StyledItemText>
              )}

              <StyledButtons>
                <StyledButton>
                  <ion-icon
                    name="create-outline"
                    className="icon icon-edit"
                    onClick={() => handleEdit(story)}
                  ></ion-icon>
                  <Tooltip>Edit Story</Tooltip>
                </StyledButton>
                <StyledButton onClick={() => handleTogglePrivacy(story.id)}>
                  {!story.hidden ? (
                    <ion-icon
                      name="lock-closed-outline"
                      className="icon icon-lock"
                    ></ion-icon>
                  ) : (
                    <ion-icon
                      name="lock-open-outline"
                      className="icon icon-lock"
                    ></ion-icon>
                  )}
                  <Tooltip>
                    {story.hidden ? "Make Story Public" : "Make Story Private"}
                  </Tooltip>
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    setModalOpen(true);
                    setCurrentStory(story);
                  }}
                >
                  <ion-icon
                    name="trash-outline"
                    className="icon icon-delete"
                  ></ion-icon>
                  <Tooltip className="tooltip-delete">Delete Story</Tooltip>
                </StyledButton>
              </StyledButtons>
            </StyledListItem>
          ))
        )}
      </StyledStoryList>

      <StyledModal $modalOpen={modalOpen}>
        <StyledModalContent>
          <p>
            Are you sure you want to delete this story? Deleting is permanent
            and cannot be undone.
          </p>
          <StyledButtons>
            <StyledModalButton onClick={() => setModalOpen(false)}>
              Cancel
            </StyledModalButton>
            <StyledModalButton
              disabled={loading}
              onClick={() => {
                handleDelete(currentStory.id);
                setModalOpen(false);
              }}
            >
              Confirm Delete
            </StyledModalButton>
          </StyledButtons>
        </StyledModalContent>
      </StyledModal>
    </StyledMyStories>
  );
}

export default MyStories;
