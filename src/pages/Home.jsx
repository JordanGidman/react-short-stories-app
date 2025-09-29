import styled from "styled-components";
import Navbar from "../components/Navbar";

import heroImg from "../img/hero-img.jpg";
import Button from "../components/Button";
import Featured from "../components/Featured";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import StoryCard from "../components/StoryCard";

const StyledHero = styled.div`
  background-image: url(${(props) => props.$img});
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
    font-size: 3.6rem;
    margin-bottom: 6rem;
    background-color: #1c1f2e;
    padding: 1rem 2rem;
    font-family: "Playfair Display", serif;
    font-weight: 600;
    box-shadow: 0rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3);

    span {
      font-style: italic;
      font-family: "Playfair Display", serif;
      padding: 0rem 1rem;
      font-weight: 500;
    }
  }
  .author {
    font-size: 3.5rem;
    font-weight: 400;
    text-transform: uppercase;
  }

  .title {
    font-size: 7rem;
    font-weight: 400;
    text-transform: uppercase;
  }

  .genre {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 6rem;
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
  background-color: rgba(170, 170, 170, 0.8);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  /* z-index: 2; */
  p {
    text-transform: uppercase;
    font-weight: 500;
    opacity: 0.6;
    font-size: 4rem;
    letter-spacing: 1rem;
  }
`;

const StyledFresh = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: calc(100vh - 7.8rem);
`;

const StyledTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 4rem;

  h1 {
    background-color: #1c1f2e;
    padding: 1rem 2rem;
    font-family: "Playfair Display", serif;
    font-weight: 900;
    box-shadow: 0rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3);
    text-transform: capitalize;
    color: #fff;

    span {
      font-style: italic;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;
    justify-content: center;
  }

  .author {
    text-transform: uppercase;
    font-size: 2.4rem;
    letter-spacing: 0.8rem;
    font-weight: 500;
  }

  .title {
    font-size: 4.8rem;
    text-transform: uppercase;
    font-family: "Playfair Display", serif;
    font-weight: 600;
  }

  .underline {
    background-color: #000;
    height: 0.1rem;
    width: 50%;
  }

  .genre {
    font-size: 1.8rem;
  }
`;
const StyledImg = styled.div`
  background-image: url(${(props) => props.$backgroundImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-color: #000;
`;

const StyledAltButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 1.4rem;
  margin-bottom: 4rem;
  text-transform: uppercase;
  font-weight: 500;
  color: #4d4d4d;

  &:hover {
    cursor: pointer;
  }
`;

const StyledPicks = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  width: 100vw;
  height: calc(100vh - 7.8rem);
  background-color: #f7f7f7;
  h1 {
    background-color: #1c1f2e;
    padding: 1rem 2rem;
    font-family: "Playfair Display", serif;
    font-weight: 900;
    box-shadow: 0rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3);
    text-transform: capitalize;
    color: #fff;
    width: auto;

    span {
      font-style: italic;
    }
  }
`;

const StyledPicksSubheading = styled.div`
  font-size: 4.8rem;
  text-transform: uppercase;
  font-weight: 600;
  font-family: "Playfair Display", serif;
`;

const StyledPicksText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  padding: 4rem;
  text-transform: uppercase;

  p {
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: 0.4rem;
  }

  .underline {
    background-color: #000;
    height: 0.1rem;
    width: 30%;
  }
`;

const StyledCardsBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100vw;
  gap: 2rem;
  padding: 4rem;
`;

function Home() {
  const [story, setStory] = useState();
  const [freshStory, setFreshStory] = useState();
  const [staffPicks, setStaffPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(staffPicks);

  useEffect(() => {
    try {
      async function fetchStories() {
        const storiesRef = collection(db, "stories");

        const q = query(storiesRef, where("isSeedData", "==", true));

        const querySnapshot = await getDocs(q);

        const fetchedStories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("fetchedStories", fetchedStories);

        setStory(
          fetchedStories[Math.floor(Math.random() * fetchedStories.length)]
        );

        //This should of course not be random but there arent any staff and there arent any real stories either. But if there were i would just have a button for staff members on each story they can click to recommend which would save the storyId to an array on the db called recommendations. Then i simply pull one for each staff member here.
        setStaffPicks(() => {
          const shuffled = [...fetchedStories].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 3);
        });

        //This should of course be finding the story with the most recent createdAt which would be as easy as checking for the smallest number for the timestamp. The issue here is that it will always just be my test story, as that is the most recent which isnt a good representation of a live site.
        setFreshStory(
          fetchedStories[Math.floor(Math.random() * fetchedStories.length)]
        );
        setLoading(false);
      }

      fetchStories();
    } catch (error) {
      console.error("Error fetching story:", error);
      setLoading(false);
    }
  }, []);

  function resizePicsum(url, width, height) {
    const parts = url.split("/");
    parts[parts.length - 2] = width; // replace 600
    parts[parts.length - 1] = height; // replace 400
    return parts.join("/");
  }

  return (
    <div>
      <StyledHero
        $img={loading ? heroImg : resizePicsum(story?.img, 1920, 1080)}
      >
        {/* "https://picsum.photos/seed/a3a60a47-6e80-46bd-a709-f6c759b36964/600/400" */}
        <StyledHeroText>
          <h1>
            What<span>to Read</span>Today
          </h1>
          {/* replace later with titles from db */}
          <p className="author">{loading ? "Loading..." : story?.author}</p>
          <p className="title">{loading ? "Loading..." : story?.title}</p>
          <p className="genre">{loading ? "Loading..." : story?.genre}</p>
          <Button
            onClick={() =>
              navigate(`/library/${story?.genre}/book/${story?.id}`)
            }
          >
            read now
          </Button>
        </StyledHeroText>
        <StyledHeroFooter>
          <p>read user written short stories</p>
        </StyledHeroFooter>
      </StyledHero>
      <Featured />
      <StyledFresh>
        <StyledTextBox>
          <h1>
            <span>Fresh</span> Arrival
          </h1>
          <div>
            <p className="author">{freshStory?.author}</p>
            <p className="title">{freshStory?.title}</p>
            <div className="underline"></div>
            <p className="genre">{freshStory?.genre}</p>
          </div>
          <Button
            onClick={() =>
              navigate(`/library/${freshStory?.genre}/Book/${freshStory.id}`)
            }
          >
            Read
          </Button>
          <StyledAltButton
            onClick={() => navigate(`/library/${freshStory?.genre}`)}
          >
            More stories like this <ion-icon name="arrow-forward"></ion-icon>
          </StyledAltButton>
        </StyledTextBox>
        <StyledImg
          $backgroundImage={
            loading ? heroImg : resizePicsum(freshStory?.img, 1280, 720)
          }
        ></StyledImg>
      </StyledFresh>
      <StyledPicks>
        <StyledPicksText>
          <h1>
            <span>Staff</span> Picks
          </h1>
          <div>
            <p>Check out what our staff are recommending</p>
            <StyledPicksSubheading>
              What should you read this week
            </StyledPicksSubheading>
          </div>
          <div className="underline"></div>
        </StyledPicksText>
        <StyledCardsBox>
          {staffPicks?.map((story) => {
            return <StoryCard story={story} />;
          })}
        </StyledCardsBox>
      </StyledPicks>
      <Footer />
      <Navbar />
    </div>
  );
}

export default Home;
