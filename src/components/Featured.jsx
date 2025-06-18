import styled from "styled-components";
import Button from "./Button";

function Featured() {
  const StyledBanner = styled.div`
    width: 100%;
    height: 30vh;
    background-color: #85e9e1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    padding: 2rem 4rem;

    h1 {
      font-size: 5rem;
      span {
        font-family: "Playfair Display", serif;
        font-weight: 900;
      }

      .highlight {
        font-style: italic;
        font-weight: 700;
      }
    }

    p {
      width: 60%;
      text-align: center;
      font-size: 1.8rem;
      margin-top: 1rem;
      color: #000;
      margin-bottom: 2rem;
    }

    /* button {
      background-color: #ffbe0b;
      border: none;
      color: #000;
      font-size: 2rem;

      padding: 1rem 3rem;
      transition: all 0.3s ease-in-out;
      margin-top: 2rem;
      font-weight: 500;
      border-radius: 2rem;

      &:hover {
        background-color: #fff;
        color: #000;
        cursor: pointer;
      }
    } */
  `;

  return (
    <div className="featured">
      <StyledBanner>
        <h1>
          <span>Check out </span>
          <span className="highlight">featured stories</span>
        </h1>
        <p>
          Featured stories chosen by our readers and their likes. Theres a story
          for every mood and situation. Make your commute or workout riveting.
          Find something you never thought you needed.
        </p>
        <Button>Browse Featured Stories</Button>
      </StyledBanner>
    </div>
  );
}

export default Featured;
