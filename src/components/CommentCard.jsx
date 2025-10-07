import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const StyledCard = styled.li`
  display: flex;
  flex-direction: column;

  background-color: #f4f4f4;
  padding: 1.2rem;
  position: relative;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  /* margin-bottom: 1rem; */
`;

const StyledAuthor = styled.div`
  font-weight: 700;
  font-size: 1.6rem;
`;

const StyledDate = styled.div`
  font-size: 1.6rem;
`;

const StyledComment = styled.div`
  font-style: italic;
  font-size: 1.4rem;
`;

const StyledDeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: none;
  font-weight: 700;
  color: #888;
  font-size: 1.6rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    cursor: pointer;
    color: #1c1f2e;
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

  ${StyledDeleteButton}:hover & {
    visibility: visible;
    opacity: 1;
    .icon {
      font-size: 2.4rem;
    }
  }
`;

function CommentCard({ comment, story }) {
  console.log(comment);

  const { currentUser } = useContext(AuthContext);

  async function handleDelete() {
    //remove the comment from the stories comments array.
    if (currentUser.id === comment.creatorID) {
      toast.error("You can only delete your comments.");
      return;
    }

    const storyRef = doc(db, "stories", story.id);

    await updateDoc(storyRef, {
      comments: arrayRemove(comment),
    });

    toast.success(`Comment deleted.`);
  }

  return (
    <StyledCard>
      <StyledWrapper>
        <StyledAuthor>{comment?.author}</StyledAuthor>
        <StyledDate>
          {new Date(comment.createdAt?.seconds * 1000).toLocaleDateString(
            "en-US"
          )}
        </StyledDate>
        {currentUser.uid === comment.creatorID && (
          <StyledDeleteButton onClick={() => handleDelete()}>
            x<Tooltip>Delete your comment</Tooltip>
          </StyledDeleteButton>
        )}
      </StyledWrapper>
      <StyledComment dangerouslySetInnerHTML={{ __html: comment.comment }} />
    </StyledCard>
  );
}

export default CommentCard;
