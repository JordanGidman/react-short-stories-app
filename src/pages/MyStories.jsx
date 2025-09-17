import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import styled from "styled-components";
import mystories from "../img/mystories.jpg";
import Navbar from "../components/Navbar";

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
  justify-content: center;
  background-color: #fff;
  width: 95vw;
  height: 100%;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2rem 4rem;
  height: 10rem;
`;

const StyledItemText = styled.p``;

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
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

function MyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  //Did not know this was even an option. I have been using a context for this so i will continue to do so for consistency but will use this in future projects.
  // const currentUser = auth.currentUser;
  const { currentUser } = useContext(AuthContext);

  console.log(stories);

  useEffect(() => {
    async function fetchStories() {
      const storiesRef = collection(db, "stories");

      const q = query(storiesRef, where("creatorID", "==", currentUser.uid));

      const querySnapshot = await getDocs(q);

      const fetchedStories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStories(fetchedStories);
      setLoading(false);
    }

    fetchStories();
  }, [currentUser]);

  function handleEdit(storyId) {
    // Logic to handle editing the story
    //Open the write story page with the fields filled with the story data
    //will need to check on the write story page if it is posting a new story or editing an existing one
  }

  function handleTogglePrivacy(storyId) {
    // Logic to handle toggling the story's privacy
    //Also need to adjust the story list to check for stories with hidden true/false and only show those that are false
  }

  function handleDelete(storyId) {
    // Logic to handle deleting the story
    //I want a pop up modal to confirm the delete action as we will permanently delete the story
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
        {stories.map((story) => (
          <StyledListItem key={story.id}>
            <StyledImg $backgroundImage={story.img} alt={story.title} />
            <StyledItemText>{story.title}</StyledItemText>
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
                ></ion-icon>
                <Tooltip>Edit Story</Tooltip>
              </StyledButton>
              <StyledButton>
                <ion-icon
                  name="lock-closed-outline"
                  className="icon icon-lock"
                ></ion-icon>
                <Tooltip>Make Story Private/Public</Tooltip>
              </StyledButton>
              <StyledButton>
                <ion-icon
                  name="trash-outline"
                  className="icon icon-delete"
                ></ion-icon>
                <Tooltip className="tooltip-delete">Delete Story</Tooltip>
              </StyledButton>
            </StyledButtons>
          </StyledListItem>
        ))}
      </StyledStoryList>
    </StyledMyStories>
  );
}

export default MyStories;
