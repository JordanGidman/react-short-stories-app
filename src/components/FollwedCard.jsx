import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";

const StyledListItem = styled.li`
  display: grid;
  position: relative;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;
  transition: all 0.3s ease-in-out;

  /* 930px */
  @media (max-width: 58.125em) {
    justify-items: center;
    padding-right: 4rem;

    grid-template-columns: repeat(3, 1fr);
    row-gap: 2rem;

    .btn-unfollow {
      grid-column: -3/-2;
    }
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

const StyledAuthor = styled(Link)`
  font-weight: 600;
  font-family: "Playfair Display", serif;
  letter-spacing: 0.1rem;
  transition: all 0.3s ease-in-out;
  text-transform: capitalize;

  &:hover {
    text-decoration: underline;
    color: #ffbe0b;
  }

  /* 930px */
  @media (max-width: 58.125em) {
    /* grid-column: span 2; */
    /* font-weight: 500; */
  }

  /* 525px */
  @media (max-width: 32.81em) {
    /* font-size: 1.4rem; */
  }
`;

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  font-family: "Montserrat", sans-serif;
  width: 80%;
`;

function FollowedCard({ author }) {
  return (
    <StyledListItem>
      <div>Image</div>
      <StyledAuthor to={`/authors/${author.id}`}>
        {author.displayName}
      </StyledAuthor>
      <p>{author.stories.length} stories</p>
      <StyledButton className="btn-unfollow">Unfollow</StyledButton>
    </StyledListItem>
  );
}

export default FollowedCard;
