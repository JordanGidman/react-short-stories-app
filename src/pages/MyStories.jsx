import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import styled from "styled-components";
// import mystories from "../img/mystories.jpg";
// import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import { toast } from "react-toastify";
// import Footer from "../components/Footer";

const StyledMyStories = styled.div`
  height: 100%;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
`;

const StyledH1 = styled.h1`
  color: rgb(28, 31, 46, 0.8);
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-style: italic;
  white-space: nowrap;
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
  height: calc(100% - 8rem);
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$span}, 1fr);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid #eee;
  width: 100%;
  padding: 2rem 0rem;
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
  /* grid-column: 6 / -1; */
`;

const StyledButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  .icon {
    font-size: 2.4rem;
  }

  .icon-edit,
  .icon-lock {
    transition: all 0.3s ease-in-out;
    &:hover {
      cursor: pointer;
      color: #ffbe0b;
    }
  }

  .icon-delete {
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #ff0000;
      cursor: pointer;
    }
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

  z-index: 999;

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
  top: 0;
  left: 0;

  backdrop-filter: blur(4px);
`;

const StyledModalButton = styled(Button)`
  transition: all 0.3s ease-in-out;
  font-weight: 600;

  &:hover {
    background-color: red;
    color: #fff;
  }
`;

function MyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
  // const notify = () => toast("Story deleted.");
  //Did not know this was even an option. I have been using a context for this so i will continue to do so for consistency but will use the below in future projects.
  // const currentUser = auth.currentUser;

  console.log(stories);

  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    if (location.state?.storyCreated && !toastShown.current) {
      toastShown.current = true;
      toast.success("Story submitted!");
    }
  }, [location]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);

    const storiesRef = collection(db, "stories");
    const q = query(storiesRef, where("creatorID", "==", currentUser.uid));

    // Use onSnapshot instead of getDocs
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fetchedStories = querySnapshot.docs
        .sort((a, b) => b.data().createdAt - a.data().createdAt)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setStories(fetchedStories);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsub();
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

      await updateDoc(storyRef, {
        hidden: !story.hidden,
      });
      toast.success(
        `Made ${story.title} ${story.hidden ? "Private" : "Public"}`
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(storyId) {
    // Logic to handle deleting the story
    setLoading(true);
    const story = stories.find((story) => story.id === storyId);
    const userRef = doc(db, "users", currentUser.uid);
    try {
      //Remove story id from users stories array.
      await updateDoc(userRef, {
        stories: arrayRemove(story.id),
      });

      //Delete the story
      await deleteDoc(doc(db, "stories", storyId));
      // //Also want to remove the story from the stories state to force a re-render
      // setStories((prevStories) =>
      //   prevStories.filter((story) => story.id !== storyId)
      // );
    } catch (err) {
      console.log(err.message);
    } finally {
      toast.success("Story deleted!");
      setLoading(false);
    }
  }

  return (
    <StyledMyStories>
      <StyledHead>
        <StyledH1>My Stories</StyledH1>
        <Search
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
        />
      </StyledHead>
      <StyledStoryList>
        {loading ? (
          <div>Loading...</div>
        ) : (
          sortedStories
            .filter(
              (story) =>
                (story.hidden !== true &&
                  story.author.toLowerCase().includes(search)) ||
                story.title.toLowerCase().includes(search)
            )
            .map((story) => (
              <StyledListItem key={story.id} $span={story.editedAt ? 6 : 5}>
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
                    {new Date(
                      story.editedAt?.seconds * 1000
                    ).toLocaleDateString("en-US")}
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
                      {story.hidden
                        ? "Make Story Private"
                        : "Make Story Public"}
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

      {/* <Footer /> */}
    </StyledMyStories>
  );
}

export default MyStories;
