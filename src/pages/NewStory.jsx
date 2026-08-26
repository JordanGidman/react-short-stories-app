import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import DOMPurify from "dompurify";
import Comments from "../components/Comments";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Error from "./Error";
import { getData } from "country-list";
import StoryCard from "../components/StoryCard";
import Button from "../components/Button";
import StoryActions from "../components/StoryActions";
import RecommendationsSection from "../components/RecommendationsSection";
import StoryHeader from "../components/StoryHeader";
import { useStory } from "../hooks/useStory";
import { useAuthor } from "../hooks/useAuthor";
import { useNavigate } from "react-router-dom";

const StyledStory = styled.div`
  display: grid;
  grid-template-columns: 40vw 1fr;
  min-height: 100vh;
  font-family: "Playfair Display", sans-serif;

  @media (max-width: 64em) {
    display: flex;
    flex-direction: column;
  }
`;

const StyledImgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40vw;
  height: 100vh;

  /* 1025px */
  @media (max-width: 64em) {
    position: static;
    height: 40vh;
    width: 100vw;
  }
`;

const StyledStoryImg = styled.div`
  width: 100%;
  height: 100%;

  background-image: url(${(props) => props.$img});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const StyledStoryContent = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 2;
  min-height: 50vh;
  padding: 3% 3% 0 3%;
  margin-top: 8rem;

  /* 1025px */
  @media (max-width: 64em) {
    margin-top: 0rem;
  }
`;

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.5rem;
  width: 100%;
  height: 4rem;

  margin: 4rem 0rem 4rem 0rem;

  @media (max-width: 64em) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 6rem;
  }
  /* 
  display: grid;
  grid-template-columns: 40% 60%; */
`;

const StyledLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;

  span {
    color: #848796;
  }

  @media (max-width: 64em) {
    grid-column: 1/4;
    grid-row: 1;
    justify-self: center;
  }
`;
const StyledLikes = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;

  span {
    color: #848796;
  }

  @media (max-width: 64em) {
    grid-row: 2;
    grid-column: 3;
    justify-self: flex-end;
  }
`;
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
  font-family: "Montserrat", serif;
  line-height: 1.6;
  font-size: ${(props) => {
    switch (props.$fontSize) {
      case "small":
        return "1.4rem";
      case "medium":
        return "1.6rem";
      case "large":
        return "1.8rem";
    }
  }};
`;

const StyledDetails = styled.div`
  border-top: 0.2rem solid rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  min-height: 30vh;
  /* margin-top: 4rem; */
  /* margin: 0rem 3% 0 3%; */
  padding-top: 2rem;
  margin-top: 4em;
`;

const StyledGenres = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-top: 2em;
  width: 100%;
  flex-wrap: wrap;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    background-color: #cecece;
    padding: 1rem 2rem;
    text-transform: capitalize;
    border-radius: 2em;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: #ffee34;
      cursor: pointer;
    }
  }
`;

const NavButtons = styled.ul`
  display: flex;
  list-style: none;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  padding-top: 4em;

  .btn-divider {
    width: 0.1rem;
    height: 4rem;
    background-color: rgba(0, 0, 0, 0.3);
    align-self: center;

    @media (max-width: 22.8em) {
      display: none;
    }
  }
`;

const BtnLink = styled(NavLink)`
  display: flex;
  text-decoration: none;
  width: 100%;
  align-items: center;
  gap: 15px;
`;

const BtnText = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 800;
  font-size: 1.8rem;

  span {
    text-transform: uppercase;
    font-weight: 400;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 0.1rem;
    font-size: 1em;

    /* 600px */
    @media (max-width: 37.5em) {
      font-size: 1.4rem;
    }
  }

  p {
    text-transform: capitalize;

    /* 600px */
    @media (max-width: 37.5em) {
      font-size: 1.6rem;
    }
  }
`;

const BtnItem = styled.li`
  width: 50%;
  display: flex;

  &:last-child {
    & ${BtnLink} {
      justify-content: flex-end;
    }

    & ${BtnText} {
      text-align: end;
    }
  }
`;

function NewStory() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  // State
  const { story, loading: storyLoading, error: storyError } = useStory(id);
  // const [story, setStory] = useState(null);
  // const sanitizedStory = useMemo(() => {
  //   return DOMPurify.sanitize(story?.storyText);
  // }, [story?.storyText]);
  const sanitizedStory = useMemo(() => {
    const dirty = story?.storyText || "";

    const cleaned = dirty
      // remove <p><br></p>
      .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "")

      // remove empty paragraphs <p></p>
      .replace(/<p>\s*<\/p>/gi, "");

    return DOMPurify.sanitize(cleaned);
  }, [story?.storyText]);
  const [user, setUser] = useState(null);
  // const [author, setAuthor] = useState(null);
  const {
    author,
    loading: authorLoading,
    error: authorError,
  } = useAuthor(story);
  const countryData = getData();
  const country = countryData.find((c) => c.code === author?.country)?.name;
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const location = useLocation();
  const [fontSize, setFontSize] = useState("medium"); // State for font size
  const navigate = useNavigate();

  //This needs to be passed again when navigating to the next or prev story in order for this same component to have access to it when opened from another page in this case the story page. The createNavigation can be found in the StoryList page.
  const navigation = location?.state?.navigation ?? [];
  const storyInfo = navigation?.storyInfo ?? [];
  //I need the index of the current story in the location.state so that i can get the names and ids of the next and previous stories
  const currentIndex = storyInfo.findIndex((s) => s.storyId === id);

  // For now we loop to the beginning or end of the few ids we have at a time but this will need to be changed to pull the next or previous set of ids from the backend as this wont work at scale. - Need refactoring as well, this looks awful.
  const nextStory =
    currentIndex !== storyInfo.length - 1
      ? storyInfo[currentIndex + 1]
      : storyInfo[0];

  const prevStory =
    currentIndex !== 0
      ? storyInfo[currentIndex - 1]
      : storyInfo[storyInfo.length - 1];

  // console.log(story.genres);

  // Fetch recommendations (2 random stories from different genres)
  useEffect(() => {
    if (!story) return;
    const recommendationsQuery = query(
      collection(db, "stories"),
      where("genres", "array-contains", story.genres[0]),
      limit(2),
    );
    const unsub = onSnapshot(
      recommendationsQuery,
      (querySnapshot) => {
        const recs = [];
        querySnapshot.forEach((doc) => {
          recs.push({ id: doc.id, ...doc.data() });
        });
        setRecommendations(recs);
        console.log(recs);
      },
      (err) => {
        console.error("Error fetching recommendations:", err);
      },
    );

    return () => unsub();
  }, [story]);

  // fetch current user data
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Your user data could not be loaded.");
        }
      },
      (err) => toast.error("Error loading your user data."),
    );

    return () => unsub();
  }, [currentUser]);

  //adjust Picsum sizes
  const resizePicsum = useCallback((url, width, height) => {
    if (url?.includes("picsum.photos")) {
      if (!url) return null;
      const parts = url.split("/");
      parts[parts.length - 2] = width;
      parts[parts.length - 1] = height;
      return parts.join("/");
    } else {
      return url;
    }
  }, []);

  //Like & Favorite handlers
  async function handleLike(userId, isLiked) {
    if (!story?.id || !userId) return;
    try {
      //Need to refactor this to be users liking stories instead of stories keeping track of which users liked them.
      await updateDoc(doc(db, "stories", story.id), {
        likesCount: isLiked ? increment(-1) : increment(1),
      });

      await updateDoc(doc(db, "users", userId), {
        likes: isLiked ? arrayRemove(story.id) : arrayUnion(story.id),
      });
      toast.success(isLiked ? "Like removed." : "Story liked!");
    } catch (err) {
      console.error("Error updating like status:", err);
      toast.error("Could not update like status.");
    }
  }

  async function handleFavorite(userId, isFavorite) {
    if (!story?.id || !userId) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        favorites: isFavorite ? arrayRemove(story.id) : arrayUnion(story.id),
      });
      toast.success(
        isFavorite
          ? `Removed ${story.title} from favorites.`
          : `${story.title} favorited!`,
      );
    } catch (err) {
      toast.error("Could not update favorites.");
    }
  }

  // Font size adjustment handler
  function adjustFontSize() {
    //i want the font size button to cycle through 3 sizes small, medium, large and then back to small. I will use a state variable to keep track of the current size and then adjust the font size accordingly.
    setFontSize((prevSize) => {
      const sizes = ["small", "medium", "large"];
      const currentIndex = sizes.indexOf(prevSize);
      const nextIndex =
        currentIndex === sizes.length - 1 ? 0 : currentIndex + 1;
      return sizes[nextIndex];
    });
  }

  if (storyLoading) return <Spinner />;
  if (storyError) return <Error error={storyError} />;

  return (
    <StyledStory>
      <StyledImgWrapper>
        <StyledStoryImg
          $img={resizePicsum(story?.img, 1280, 720) || "/placeholder.jpg"}
        />
      </StyledImgWrapper>
      <StyledStoryContent>
        <StoryHeader
          story={story}
          author={author}
          country={country}
          countryData={countryData}
        />
        {/* Banner */}
        <StyledBanner>
          {/* Buttons */}
          <StoryActions
            story={story}
            user={user}
            currentUser={currentUser}
            onLike={handleLike}
            onFavorite={handleFavorite}
            onFontSizeChange={adjustFontSize}
          />
          {/* Language and Likes */}
          <StyledLanguage>
            <strong>Read in:</strong>{" "}
            <span>{story?.language || "English"}</span>
          </StyledLanguage>
          <StyledLikes>
            <strong>{story?.likesCount || 0} </strong>
            <span>likes</span>
          </StyledLikes>
        </StyledBanner>
        {/* Main story content */}
        {!story.isSeedData ? (
          <StyledBody
            $fontSize={fontSize}
            dangerouslySetInnerHTML={{ __html: sanitizedStory }}
          />
        ) : (
          <StyledBody $fontSize={fontSize}>
            <p>
              This is a seed data story created using fakerJS. Full styling is{" "}
              <strong>not</strong> available. For the best example, please view
              any "Test Story" in the fantasy genre or create your own!
            </p>
            <p>{story.storyText}</p>
          </StyledBody>
        )}

        <Comments storyId={story.id} />
        <StyledDetails>
          <StyledGenres>
            {story.genres.map((genre, index) => (
              <p key={index} onClick={() => navigate(`/library/${genre}`)}>
                {genre}
              </p>
            ))}
            {/* <p>{story.genre}</p> */}
            {/* <p>Horror</p>
            <p>Thriller</p>
            <p>Existential</p> */}
          </StyledGenres>

          {location.state && (
            <NavButtons>
              <BtnItem>
                <BtnLink
                  to={`/library/${story.genres[0]}/story/${prevStory.storyId}`}
                  state={{ navigation }}
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                  <BtnText>
                    <span>Previous</span>
                    <p>{prevStory.title}</p>
                  </BtnText>
                </BtnLink>
              </BtnItem>
              <div className="btn-divider"></div>
              <BtnItem>
                <BtnLink
                  to={`/library/${story.genres[0]}/story/${nextStory.storyId}`}
                  state={{ navigation }}
                >
                  <BtnText>
                    <span>Next</span>
                    <p>{nextStory.title}</p>
                  </BtnText>
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </BtnLink>
              </BtnItem>
            </NavButtons>
          )}
          <RecommendationsSection recommendations={recommendations} />
        </StyledDetails>
      </StyledStoryContent>
    </StyledStory>
  );
}

export default NewStory;
