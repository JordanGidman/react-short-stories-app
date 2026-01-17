import styled from "styled-components";
import Navbar from "../components/Navbar";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// import heroImg from "../img/hero-img.jpg";
import Button from "../components/Button";
// import Featured from "../components/Featured";
const Featured = lazy(() => import("../components/Featured"));
const StaffPicks = lazy(() => import("../components/StaffPicks"));
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

const StyledMain = styled.main``;

const StyledHero = styled.div`
  /* background-image: url(${(props) => props.$img}); */
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: 2;
  position: relative;

  //Dim image brightness overlay
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

const StyledHeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

  @media (max-width: 31.25em) {
    gap: 1rem;

    h1 {
      font-size: 2.6rem;
    }

    .author {
      font-size: 2.4rem;
    }

    .title {
      font-size: 4.8rem;
    }

    .genre {
      font-size: 2.4rem;
    }
  }

  @media (max-width: 21.9em) {
    .title {
      font-size: 4.2rem;
    }
  }
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

    /* 1140px */
    @media (max-width: 71.25em) {
      font-size: 3rem;
      text-align: center;
    }

    @media (max-width: 44em) {
      font-size: 2rem;
      letter-spacing: 0.5rem;
    }
  }
`;

const StyledFresh = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: calc(100vh - 7.8rem);

  @media (max-width: 58.2em) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    height: 100vh;
  }
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
    font-weight: 900;
  }

  .underline {
    background-color: #000;
    height: 0.1rem;
    width: 50%;
  }

  .genre {
    font-size: 1.8rem;
  }

  @media (max-width: 58.2em) {
    padding-bottom: 1rem;
    h1 {
      font-size: 1.6rem;
    }

    div {
      gap: 0.8rem;
    }

    .author {
      font-size: 1.8rem;
      letter-spacing: 0.5rem;
    }

    .title {
      font-size: 3.6rem;
    }

    .genre {
      font-size: 1.6rem;
    }
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

const StyledFreshButton = styled(Button)`
  font-size: 1.4rem;
  font-weight: 600;
  color: #1c1f2e;
  padding: 0.6rem 4rem;
  margin-bottom: 2rem;
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
  const resizePicsum = useCallback((url, width, height) => {
    if (!url) return null;
    const parts = url.split("/");
    parts[parts.length - 2] = width;
    parts[parts.length - 1] = height;
    return parts.join("/");
  }, []);

  const heroImage = useMemo(() => {
    return story?.img
      ? resizePicsum(story.img, 1280, 720)
      : "https://picsum.photos/seed/fallback/1280/720";
  }, [story, resizePicsum]);

  const freshImage = useMemo(() => {
    return freshStory?.img
      ? resizePicsum(freshStory.img, 1280, 720)
      : "https://picsum.photos/seed/fallback2/1920/1080";
  }, [freshStory, resizePicsum]);

  // if (loading) {
  //   return (
  //     <>
  //       <Navbar />
  //       <Spinner $height={"calc(100vh - 8rem)"} />
  //     </>
  //   );
  // }

  if (isCriticalError) {
    return (
      <Error
        error={{ message: "Failed to load stories. Please try again later." }}
      />
    );
  }

  //Normal UI render
  return (
    <StyledMain>
      {/* {!loading ? ( */}
      <StyledHero>
        <StyledHeroImage
          src={heroImage}
          srcSet={
            story?.img
              ? `
        ${resizePicsum(story.img, 640, 360)} 640w,
        ${resizePicsum(story.img, 1280, 720)} 1280w,
        ${resizePicsum(story.img, 1920, 1080)} 1920w
      `
              : undefined
          }
          sizes="100vw"
          alt={story?.title || "Featured story"}
          loading="eager"
          fetchPriority="high"
        />
        <StyledHeroText>
          <h1>
            What<span>to Read</span>Today
          </h1>
          <p className="author">{story?.author || "Loading..."}</p>
          <p className="title">{story?.title || "Loading..."}</p>
          <p className="genre">{story?.genre || "Loading..."}</p>
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
      {/* ) : (
        <Spinner />
       )} */}

      <Suspense fallback={null}>
        <Featured />
      </Suspense>

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
          <StyledFreshButton
            onClick={() =>
              navigate(`/library/${freshStory?.genre}/book/${freshStory?.id}`)
            }
          >
            Read
          </StyledFreshButton>
          <StyledAltButton
            onClick={() => navigate(`/library/${freshStory?.genre}`)}
          >
            More stories like this <ion-icon name="arrow-forward"></ion-icon>
          </StyledAltButton>
        </StyledTextBox>
        <StyledImg $backgroundImage={freshImage}></StyledImg>
      </StyledFresh>
      <Suspense fallback={null}>
        <StaffPicks staffPicks={staffPicks} />
      </Suspense>
    </StyledMain>
  );
}

export default Home;
