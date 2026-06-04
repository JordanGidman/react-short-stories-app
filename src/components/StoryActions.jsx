import styled from "styled-components";

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  ion-icon {
    font-size: 2.4rem;
    --ionicon-stroke-width: 45px;
  }

  .font-size {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    font-weight: 600;
    font-family: "Playfair Display", sans-serif;
  }

  &:hover {
    transform: translateY(-15%);
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
  font-size: 1.4rem;
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

function StoryActions({ story, user, currentUser, onLike, onFavorite }) {
  return (
    <StyledButtons>
      {/* Like Button */}
      <StyledButton
        onClick={() => onLike(currentUser.uid, user?.likes?.includes(story.id))}
      >
        {user?.likes?.includes(story.id) ? (
          <ion-icon name="heart"></ion-icon>
        ) : (
          <ion-icon name="heart-outline"></ion-icon>
        )}
        <Tooltip>
          {user?.likes?.includes(story.id) ? "Remove Like" : "Like Story"}
        </Tooltip>
      </StyledButton>
      {/* Favorite Button */}
      <StyledButton
        onClick={() =>
          onFavorite(currentUser.uid, user?.favorites?.includes(story.id))
        }
      >
        {user?.favorites?.includes(story.id) ? (
          <ion-icon className="icon-star" name="star"></ion-icon>
        ) : (
          <ion-icon className="icon-star" name="star-outline"></ion-icon>
        )}
        <Tooltip>
          {user?.favorites?.includes(story.id)
            ? "Remove Favorite"
            : "Favorite Story"}
        </Tooltip>
      </StyledButton>
      {/* Font Size Button */}
      <StyledButton>
        <span className="font-size">Aa</span>
        <Tooltip>Font size</Tooltip>
      </StyledButton>
    </StyledButtons>
  );
}

export default StoryActions;
