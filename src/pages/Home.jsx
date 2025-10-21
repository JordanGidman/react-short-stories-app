import styled from "styled-components";
import Navbar from "../components/Navbar";

import heroImg from "../img/hero-img.jpg";
import Button from "../components/Button";
import Featured from "../components/Featured";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import StoryCard from "../components/StoryCard";
import Error from "../pages/Error";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

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
  const [error, setError] = useState(null);
  const [isCriticalError, setIsCriticalError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);

  //Handle sign in/up toasts
  useEffect(() => {
    if (location.state?.justSignedIn && !toastShown.current) {
      toastShown.current = true;
      toast.success("Signed in");
    } else if (location.state?.justSignedUp && !toastShown.current) {
      toastShown.current = true;
      toast.success("Signed up");
    }
  }, [location]);

  useEffect(() => {
    let cancelled = false;

    async function fetchStories() {
      setLoading(true);
      setError(null);
      setIsCriticalError(false);

      try {
        const rand = Math.random();
        const storiesRef = collection(db, "stories");

        // primary query
        let q = query(
          storiesRef,
          where("isSeedData", "==", true),
          orderBy("randomNumber"),
          startAt(rand),
          limit(5)
        );

        let querySnapshot = await getDocs(q);
        let fetchedStories = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        //wrap-around to the start of the stories arr if we didn't get enough
        if (fetchedStories.length < 5) {
          const remaining = 5 - fetchedStories.length;
          const q2 = query(
            storiesRef,
            where("isSeedData", "==", true),
            orderBy("randomNumber"),
            limit(remaining)
          );
          const qs2 = await getDocs(q2);
          fetchedStories = [
            ...fetchedStories,
            ...qs2.docs.map((d) => ({ id: d.id, ...d.data() })),
          ];
        }

        if (cancelled) return;

        //Determine critical vs component error using local fetchedStories
        if (!fetchedStories || fetchedStories.length === 0) {
          //No stories at all — treat as critical (page can't render)
          setIsCriticalError(true);
          setError(new Error("No stories found."));
          setStory(undefined);
          setStaffPicks([]);
          setFreshStory(undefined);
        } else {
          //We have at least some stories — non-critical
          setIsCriticalError(false);

          //Display what is available
          setStory(fetchedStories[0]);
          setStaffPicks(fetchedStories.slice(1, 4));
          setFreshStory(fetchedStories[4]);

          //If we returned fewer than expected, show a warning toast (partial)
          if (fetchedStories.length < 5) {
            toast.warn("Missing some stories");
          }

          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching stories:", err);
        //If fetch failed, treat as critical error so page can't render
        setError(err);
        setIsCriticalError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStories();

    return () => {
      cancelled = true;
    };
    //no dependencies -> run once on mount
  }, []);

  //adjust Picsum sizes
  function resizePicsum(url, width, height) {
    if (!url) return null;
    const parts = url.split("/");
    parts[parts.length - 2] = width;
    parts[parts.length - 1] = height;
    return parts.join("/");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Spinner $height={"calc(100vh - 8rem)"} />
      </>
    );
  }

  if (isCriticalError) {
    return (
      <Error
        error={{ message: "Failed to load stories. Please try again later." }}
      />
    );
  }

  //Normal UI render
  return (
    <div>
      {!loading ? (
        <StyledHero
          $img={
            story?.img
              ? resizePicsum(story.img, 1920, 1080)
              : "https://picsum.photos/seed/fallback/1920/1080"
          }
        >
          <StyledHeroText>
            <h1>
              What<span>to Read</span>Today
            </h1>
            <p className="author">{story?.author || "Unknown Author"}</p>
            <p className="title">{story?.title || "Untitled"}</p>
            <p className="genre">{story?.genre || "Unknown Genre"}</p>
            <Button
              onClick={() =>
                navigate(`/library/${story?.genre}/story/${story?.id}`)
              }
            >
              read now
            </Button>
          </StyledHeroText>
          <StyledHeroFooter>
            <p>read user written short stories</p>
          </StyledHeroFooter>
        </StyledHero>
      ) : (
        <Spinner />
      )}

      <Featured />

      <StyledFresh>
        <StyledTextBox>
          <h1>
            <span>Fresh</span> Arrival
          </h1>
          <div>
            <p className="author">{freshStory?.author || "Unknown Author"}</p>
            <p className="title">{freshStory?.title || "Title not found"}</p>
            <div className="underline"></div>
            <p className="genre">{freshStory?.genre || "Genre not found"}</p>
          </div>
          <Button
            onClick={() =>
              navigate(`/library/${freshStory?.genre}/book/${freshStory?.id}`)
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
            freshStory?.img
              ? resizePicsum(freshStory.img, 1280, 720)
              : "https://picsum.photos/seed/fallback2/1920/1080"
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
          {staffPicks.length > 0 ? (
            staffPicks.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))
          ) : (
            <p>No staff picks available.</p>
          )}
        </StyledCardsBox>
      </StyledPicks>
    </div>
  );
}

export default Home;
