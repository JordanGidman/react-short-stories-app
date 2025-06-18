import styled from "styled-components";
import Navbar from "./Navbar";

import heroImg from "../img/hero-img.jpg";
import Button from "./Button";

const StyledHero = styled.div`
  background-image: url(${(props) => props.img});
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: 2;
  /* filter: brightness(0.7); */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
`;

const StyledHeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  color: #fff;
  text-align: center;
  z-index: 2;
  width: 100%;

  h1 {
    font-size: 4rem;
    margin-bottom: 2rem;
    background-color: #1c1f2e;
    padding: 1rem 2rem;
    font-family: "Playfair Display", serif;
    font-weight: 900;
    span {
      font-style: italic;
      font-family: "Playfair Display", serif;
      padding: 0rem 1rem;
      font-weight: 600;
    }
  }
  .author {
    font-size: 3.5rem;
    font-weight: 400;
  }

  .title {
    font-size: 7rem;
    font-weight: 400;
  }

  .reading-time {
    font-size: 3rem;
    font-weight: 300;
  }

  /* button {
    background-color: #ffbe0b;
    border: none;
    color: #000;
    font-size: 2rem;
    letter-spacing: 0.1rem;
    padding: 1rem 3rem;
    transition: all 0.3s ease-in-out;
    margin-top: 2rem;
    font-weight: 500;
    border-radius: 2rem;
    text-transform: uppercase;

    &:hover {
      background-color: #fff;
      color: #000;
      cursor: pointer;
    }
  } */
`;

const StyledHeroFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  /* z-index: 2; */
  p {
    text-transform: uppercase;
    font-weight: bold;
    opacity: 0.6;
    font-size: 4rem;
  }
`;
function Home() {
  return (
    <div>
      <StyledHero img={heroImg}>
        <StyledHeroText>
          <h1>
            What <span>to read</span> today
          </h1>
          <p className="author">Jordan Gidman</p>
          {/* replace later with selected titles and names to change each day */}
          <p className="title">A Tale of Tarkov Extract Campers</p>
          <p className="reading-time">5 min read</p>
          <Button>read now</Button>
        </StyledHeroText>
        <StyledHeroFooter>
          <p>read user written short stories</p>
        </StyledHeroFooter>
      </StyledHero>
      <Navbar />
    </div>
  );
}

export default Home;
