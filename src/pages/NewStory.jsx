import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc,
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

const StyledStory = styled.div`
  display: grid;
  grid-template-columns: 40vw 1fr;
  min-height: 100vh;
  font-family: "Playfair Display", sans-serif;
`;

const StyledImgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40vw;
  height: 100vh;
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
`;

const StyledHeader = styled.header`
  display: flex;
  gap: 2rem;
  align-items: center;

  margin-top: 4rem;
`;

const StyledWrapper = styled.div`
  flex: 1;
  border-left: 1px solid black;
  padding-left: 2rem;
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
          <StyledButtons>
            {/* Like Button */}
            <StyledButton
              onClick={() =>
                handleLike(currentUser.uid, user?.likes?.includes(story.id))
              }
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
                handleFavorite(
                  currentUser.uid,
                  user?.favorites?.includes(story.id),
                )
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
      </StyledStoryContent>
      <Comments storyId={story.id} />
    </StyledStory>
  );
}

export default NewStory;
