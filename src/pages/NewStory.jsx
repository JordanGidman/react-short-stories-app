import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
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

  @media (max-width: 64em) {
    margin-top: 0rem;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  gap: 2rem;
  align-items: center;

  margin-top: 4rem;

  @media (max-width: 64em) {
    margin-top: 2rem;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
`;

const StyledWrapper = styled.div`
  flex: 1;
  border-left: 1px solid black;
  padding-left: 2rem;

  @media (max-width: 64em) {
    border-left: none;
    padding: 0rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const StyledAuthor = styled.p`
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-decoration: none;
  padding-bottom: 0.9em;
`;
const StyledTitle = styled.h1`
  text-transform: capitalize;
  margin-bottom: 4rem;
  /* margin-bottom: auto; */
`;
const StyledWordCount = styled.div`
  font-size: 1.1em;
  font-family: "Montserrat", sans-serif;
  color: #848796;
  font-weight: 500;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ion-icon {
      font-size: 2.2rem;
      --ionicon-stroke-width: 50px;
      color: #1c1f2e;
    }
  }

  @media (max-width: 64em) {
    justify-content: center;
  }
`;
const StyledCountry = styled.p`
  font-size: 1.8rem;
  writing-mode: tb-rl;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  color: #848796;
  letter-spacing: 0.2rem;
  rotate: 180deg;

  @media (max-width: 64em) {
    display: none;
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
`;
const StyledLikes = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;

  span {
    color: #848796;
  }
`;
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
  font-family: "Montserrat", serif;
  line-height: 1.6;
`;

const StyledDetails = styled.div`
  border-top: 0.2rem solid rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  min-height: 30vh;
  /* margin-top: 4rem; */
  /* margin: 0rem 3% 0 3%; */
  padding-top: 2rem;
`;

const StyledGenres = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-top: 2em;
  width: 100%;

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
    font-size: 1.2rem;
    font-weight: 400;
    font-family: "Montserrat", sans-serif;
    letter-spacing: 0.1rem;
    font-size: 1em;
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

const StyledOffersText = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  margin-top: 4em;
  margin-bottom: 4em;
  h2 {
    font-size: 3rem;
    font-weight: 700;
    text-transform: capitalize;
    font-family: "Playfair Display", serif;
  }

  ion-icon {
    font-size: 4rem;
    /* --ionicon-stroke-width: 50px; */
  }

  div {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 80%;
  }

  .black-bar {
    height: 0.1rem;
    background-color: #1c1f2e;
    width: 100%;
  }
`;

const StoryCardBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 2rem;
  margin-bottom: 4em;
`;

const CustomStoryCard = styled.div`
  /* width: 50%; */
  min-height: 35vh;
  padding: 1rem;
  color: #fff;

  background-image:
    linear-gradient(to top, rgb(28, 31, 46) 0%, rgba(0, 0, 0, 0) 80%),
    url(${(props) => props.story.img || "/placeholder.jpg"});

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  .word-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    justify-self: flex-end;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 90%;
    justify-content: flex-end;
    z-index: 999;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 1.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
  }

  p {
    font-family: "Playfair Display", sans-serif;
    font-weight: 300;
    font-size: 2.6rem;
    font-weight: 700;
    text-transform: capitalize;
    margin-bottom: 4rem;
  }
`;

const StyledReadBtn = styled(Button)`
  width: fit-content;
`;

function NewStory() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  // State
  const [story, setStory] = useState(null);
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
  const [author, setAuthor] = useState(null);
  const countryData = getData();
  const country = countryData.find((c) => c.code === author?.country)?.name;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // fetch story
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const storyRef = doc(db, "stories", id);

    const unsub = onSnapshot(
      storyRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setStory({ id: docSnap.id, ...docSnap.data() });
          setError(null);
        } else {
          setError(new Error("Story not found."));
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [id]);

  // Fetch recommendations (2 random stories from different genres)
  useEffect(() => {
    if (!story) return;
    const recommendationsQuery = query(
      collection(db, "stories"),
      where("genre", "!=", story.genre),
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
  }, [story]);

  // fetch current user
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

  //fetch author
  useEffect(() => {
    if (!story?.creatorID) return;

    async function fetchAuthor() {
      try {
        const snap = await getDoc(doc(db, "users", story.creatorID));
        if (snap.exists()) {
          setAuthor({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        toast.error("Error fetching author data.");
      }
    }

    fetchAuthor();
  }, [story?.creatorID]);

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

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <StyledStory>
      <StyledImgWrapper>
        <StyledStoryImg
          $img={resizePicsum(story?.img, 1280, 720) || "/placeholder.jpg"}
        />
      </StyledImgWrapper>
      <StyledStoryContent>
        <StyledHeader>
          <StyledCountry>
            {country && country.length < 15
              ? country
              : countryData?.find((c) => c.code === author?.country)?.code ||
                "Loading..."}
          </StyledCountry>
          <StyledWrapper>
            <StyledAuthor>{story?.author}</StyledAuthor>
            <StyledTitle>{story?.title}</StyledTitle>
            <StyledWordCount>
              <div>
                <ion-icon name="timer-outline"></ion-icon>
                <span>{story?.storyText?.split(" ").length || 0} words</span>
              </div>
            </StyledWordCount>
          </StyledWrapper>
        </StyledHeader>
        {/* Banner */}
        <StyledBanner>
          {/* Buttons */}
          <StoryActions
            story={story}
            user={user}
            currentUser={currentUser}
            onLike={handleLike}
            onFavorite={handleFavorite}
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
          <StyledBody dangerouslySetInnerHTML={{ __html: sanitizedStory }} />
        ) : (
          <StyledBody>
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
            {/* temp */}
            <p>Horror</p>
            <p>Thriller</p>
            <p>Existential</p>
          </StyledGenres>

          <NavButtons>
            <BtnItem>
              <BtnLink to="#">
                <ion-icon name="chevron-back-outline"></ion-icon>
                <BtnText>
                  <span>Previous</span>
                  <p>Book Name</p>
                </BtnText>
              </BtnLink>
            </BtnItem>
            <div className="btn-divider"></div>
            <BtnItem>
              <BtnLink to="#">
                <BtnText>
                  <span>Next</span>
                  <p>Book Name</p>
                </BtnText>
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </BtnLink>
            </BtnItem>
          </NavButtons>
          <StyledOffersText>
            <h2>Want something different?</h2>
            <div>
              <ion-icon name="arrow-down-outline"></ion-icon>
              <div className="black-bar"></div>
            </div>
          </StyledOffersText>
          <StoryCardBox>
            {recommendations.map((rec) => (
              <CustomStoryCard key={rec.id} story={rec}>
                <div className="word-count">
                  <ion-icon name="timer-outline"></ion-icon>
                  {rec.storyText.split(" ").length} Words
                </div>
                <div className="info">
                  <span>{rec.author}</span>
                  <p>{rec.title}</p>

                  <StyledReadBtn>Read</StyledReadBtn>
                </div>
              </CustomStoryCard>
            ))}
          </StoryCardBox>
        </StyledDetails>
      </StyledStoryContent>
    </StyledStory>
  );
}

export default NewStory;
