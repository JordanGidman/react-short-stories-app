import { faker } from "@faker-js/faker";
import styled from "styled-components";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

let testImg = faker.image.personPortrait();
console.log(testImg);

const StyledAuthorProfile = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 40% 60%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 8% 2% 2% 2%;
  font-family: "Playfair Display", sans-serif;
`;

const StyledImgWrapper = styled.div`
  position: fixed;
  height: 100%;
  width: 40%;

  display: grid;
  grid-template-columns: 18% 82%;
`;

const StyledAuthorImg = styled.div`
  height: 100%;
  /* width: 100%; */
  background-image: url(${(props) => props.$img});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const StyledBanner = styled.div`
  /* display: flex;
  justify-content: center;
  height: 100%;
  width: 10%;
  padding: 4rem 2rem;
  background-color: #fff;
  text-orientation: upright; */
  width: 100%;
  writing-mode: tb-rl;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 4rem 1rem;
  background-color: #fff;

  margin: 0;

  span {
    font-size: 4rem;
    font-weight: 700;
    font-family: "Playfair Display", sans-serif;
    background-color: #fff;
    color: #313131;
    rotate: 180deg;
    padding: 0;
    letter-spacing: 0.1rem;
    /* width: 100%; */
  }
`;
const StyledAuthorInfo = styled.div`
  width: 100vw;
  height: 100%;

  display: grid;
  grid-template-columns: 40% 60%;

  /* div {
    width: 100%;
    height: 100%;
  } */
`;

const StyledInfoWrapper = styled.div`
  padding: 6rem 4rem;
  width: 100%;
`;

const StyledH1 = styled.h1`
  font-size: 6.4rem;
  color: #313131;
`;

const StyledSubheading = styled.h3`
  font-size: 2rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #848796;
  font-weight: 500;
  margin-bottom: 4rem;
  font-family: "Montserrat", sans-serif;
`;

const FollowButton = styled(Button)`
  font-weight: 500;
  letter-spacing: 0.1rem;
  font-family: "Montserrat", sans-serif;
`;

const StyledOverview = styled.div`
  display: flex;
  align-items: flex-start;
  width: 90%;

  margin-top: 16rem;
  margin-bottom: 16rem;
  padding-left: 3rem;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.2;
  /* padding: 0rem 12rem 0rem 0rem; */
`;

const StyledStories = styled.section``;
const StyledTitle = styled.h2`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-right: 4rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  span {
    font-size: 3.2rem;
    letter-spacing: 0.2rem;
    font-style: italic;
  }
`;

const StyledLine = styled.div`
  background-color: #000;
  width: 100%;
  height: 0.1rem;
`;

const StoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-right: 4rem;
  gap: 1rem;
  min-height: 30vh;
  margin-top: 6rem;
`;

const StyledCard = styled.div`
  position: relative;
  height: 25rem;
  width: 25rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: 2rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(
      to top,
      rgba(28, 31, 46, 1),
      rgba(28, 31, 46, 0)
    );
    z-index: 1;
  }

  * {
    position: relative;
    z-index: 2;
  }

  p {
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: 500;
    font-family: "Montserrat", sans-serif;
  }

  h4 {
    font-size: 3rem;
    text-transform: capitalize;
    margin-bottom: 2rem;
  }
`;

function AuthorProfile() {
  // Here we want to be able to:
  // - Fetch and view all stories made by an author
  // - Follow the author
  // - Most liked section
  // - Header
  // - Need to change what is shown and changeable based on if its the current users page or someone elses.
  const { id } = useParams();
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Fetch stories made by the current user
  useEffect(() => {
    setLoading(true);

    const storiesRef = collection(db, "stories");
    const q = query(
      storiesRef,
      where("creatorID", "==", id),
      where("hidden", "==", false),
    );

    // Use onSnapshot instead of getDocs
    const unsub = onSnapshot(q, (querySnapshot) => {
      const fetchedStories = querySnapshot.docs
        .sort((a, b) => b.data().createdAt - a.data().createdAt)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      console.log(fetchedStories);

      setStories(fetchedStories);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsub();
  }, [id]);

  return (
    <StyledAuthorProfile>
      <StyledImgWrapper>
        <StyledBanner>
          <span>Jordan Giddy</span>
        </StyledBanner>
        <StyledAuthorImg $img={testImg} />
      </StyledImgWrapper>

      <StyledAuthorInfo>
        <div></div>
        <StyledInfoWrapper>
          <StyledH1>Jordan Giddy</StyledH1>
          <StyledSubheading>Spain</StyledSubheading>
          <FollowButton>+ Follow Author</FollowButton>
          <StyledOverview>
            Her debut novel, Panza de Burro, was first published in Spain to
            great acclaim. In 2021, Jordan Giddy was included in Granta‘s new
            selection in a decade of the Best of Young Spanish Language
            Novelists. Photograph © Alex de la Torre
          </StyledOverview>
          <StyledStories>
            <StyledTitle>
              <span>Stories By This Author</span>
              <StyledLine></StyledLine>
            </StyledTitle>
            <StoriesContainer>
              {stories.map((story) => {
                return (
                  <StyledCard key={story.id} $backgroundImage={story.img}>
                    <p>{story.author}</p>
                    <h4>{story.title}</h4>
                    <Button>Read</Button>
                  </StyledCard>
                );
              })}
            </StoriesContainer>
          </StyledStories>
        </StyledInfoWrapper>
      </StyledAuthorInfo>
    </StyledAuthorProfile>
  );
}

export default AuthorProfile;
