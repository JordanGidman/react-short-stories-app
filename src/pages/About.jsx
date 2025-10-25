import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StyledAbout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4rem;
`;

const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: ${(props) => (props.$flipped ? "60% 40%" : "40% 60%")};
  gap: 6rem;
  padding: 6rem 4rem;
  padding-bottom: 4rem;
  font-family: "Playfair Display", serif;
  width: 94%;

  padding-right: ${(props) => (props.$flipped ? "8rem" : "4rem")};
  p {
    font-size: 3rem;
    width: 70%;
    font-weight: 700;
  }

  /* 1145px */
  @media (max-width: 71.56em) {
    width: 100%;
  }

  /* 650px */
  @media (max-width: 40.7em) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: ${(props) => (props.$flipped ? "4rem" : "4rem")};
    /* padding-right: 0rem; */
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 94%;
  /* justify-content: center; */
  min-height: calc(100vh - 8rem);
  margin-top: 8rem;

  /* 1145px */
  @media (max-width: 71.56em) {
    width: 100%;
  }

  /* 650px */
  @media (max-width: 40.7em) {
    margin-top: 0rem;
  }
`;

const StyledHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    width: 90%;
  }

  .underline {
    background-color: #000;
    height: 0.1rem;
    width: 10%;

    /* 650px */
    @media (max-width: 40.7em) {
      width: 40%;
      margin-bottom: 2rem;
      align-self: center;
    }
  }

  /* 1145px */
  @media (max-width: 71.56em) {
    p {
      font-size: 2.4rem;
    }
  }

  /* 650px */
  @media (max-width: 40.7em) {
    text-align: center;
    order: ${(props) => (props.$flipped ? "2" : "1")};
  }
`;

const StyledH1 = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 6rem 4rem;
  font-size: 8rem;
  width: 100%;
  background-color: #fff;
  font-weight: 900;

  span {
    font-style: italic;
    font-weight: 400;
  }

  /* 1406px */
  @media (max-width: 88em) {
    font-size: 6rem;
  }

  /* 1145px */
  @media (max-width: 71.56em) {
    text-align: center;
    flex-direction: column;
  }
`;

const StyledBody = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94vw;
  padding: 0rem 4rem;
  flex: 1;

  /* 650px */
  @media (max-width: 40.7em) {
    padding: 0rem 2rem;
  }
`;
const StyledBodyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  justify-content: center;
  text-align: left;
  border-left: 0.1rem solid #000;
  padding: 4rem;
  padding-left: 8rem;
  width: 60%;
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.5em;
  color: #1c1f2e;

  p {
    width: 100%;

    a {
      color: darkblue;
      font-weight: 700;
      text-decoration: underline;
      transition: all 0.3s ease-in-out;

      &:hover {
        color: #1c1f2e;
      }
    }
  }

  /* 1145px */
  @media (max-width: 71.56em) {
    width: 80%;
  }

  /* 650px */
  @media (max-width: 40.7em) {
    width: 100%;
    margin-bottom: 2rem;
    align-self: center;
    padding: 2rem;
    gap: 1rem;
  }
`;

const StyledBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffee34;
  gap: 1rem;
  width: 94vw;
  padding: 6rem 4rem;
  font-family: "Playfair Display", serif;
  margin-top: 4rem;
  text-align: center;

  p {
    font-size: 1.6rem;
    font-weight: 600;
  }

  em {
    font-style: italic;
    font-size: 2.8rem;
    font-weight: 800;
  }

  /* 710px */
  @media (max-width: 44.375em) {
    p {
      font-size: 1.4rem;
    }

    em {
      font-size: 2.6rem;
    }
  }
`;

const StyledBannerH1 = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  /* padding: 4rem; */
  font-size: 7rem;
  width: 100%;

  font-weight: 900;
  span {
    font-style: italic;
    font-weight: 400;
  }

  /* 710px */
  @media (max-width: 44.375em) {
    font-size: 6rem;
    flex-direction: column;
    gap: 0rem;
  }
`;

function About() {
  return (
    <StyledAbout>
      {/* <Navbar /> */}
      <StyledWrapper>
        <StyledHeader $flipped={false}>
          <StyledH1>
            <span>Our</span> Story
          </StyledH1>
          <StyledHeaderText>
            <div className="underline"></div>
            <p>
              Tell your story is an online platform and project of mine
              dedicated the art of short form story telling.
            </p>
          </StyledHeaderText>
        </StyledHeader>
        <StyledBody>
          <StyledBodyText>
            <p>
              I made this project as someone who used to love to write my own
              stories when i was younger.
            </p>
            <p>
              I think literature is and always has been the perfect tool to
              capture the amazing and the outrageous, the absurd and the
              mystifying, the ordinary and overlooked, the human condition in
              all its glorious complexity and intricacy.
            </p>
            <p>
              To give people a chance to prove that i have tasked myself with
              building a platform on which users can create their own stories,
              their own amazing ideas and narratives and share them for public
              consumption. There are a lot of people out there who arent writers
              by trade but are filled with ideas and tell your story aims to
              give them an outlet and with it brighten all our days with some
              lovely short stories.
            </p>
          </StyledBodyText>
        </StyledBody>
      </StyledWrapper>
      <StyledBanner>
        <StyledBannerH1>
          Why <span>Short Stories?</span>
        </StyledBannerH1>
        <p>As F. Scott Fitzgerald once put it:</p>
        <em>
          “Find the key emotion; this may be all you need know to find your
          short story.”
        </em>
        <p>They're quick, impactful and succinct. </p>
      </StyledBanner>

      {/* Page 2 */}
      <StyledWrapper>
        <StyledHeader $flipped={true}>
          <StyledHeaderText $flipped={true}>
            <div className="underline"></div>
            <p>
              Because we respect your time. The user feedback in the form of
              likes and comments gets you reading quality content instantly.
            </p>
          </StyledHeaderText>
          <StyledH1>
            Why <span>Us?</span>
          </StyledH1>
        </StyledHeader>
        <StyledBody>
          {/* <div className="underline"></div> */}
          <StyledBodyText>
            <p>
              I wanted users to have the ability to at a glance know which
              stories might be worth reading. I wanted to keep with the theme of
              quick reading and sometimes we dont have the time to go through a
              lot of stories to find what we are looking for.
            </p>
            <p>
              To aid this you can like stories you enjoyed and so can others and
              then with our extensive searching and sorting features you can
              find the most liked stories straight away, getting you stuck in as
              quick as possible to something at least other users have enjoyed.
              That doesnt mean if a story doesnt have a lot of likes that it
              isnt good it may not have been read as much so if you do have time
              please check out anything and everything and find those hidden
              gems.
            </p>
          </StyledBodyText>
        </StyledBody>
      </StyledWrapper>
      {/* 3rd page */}
      <StyledWrapper>
        <StyledHeader $flipped={false}>
          <StyledH1>
            Who <span>Am i?</span>
          </StyledH1>
          <StyledHeaderText>
            <div className="underline"></div>
            <p>Meet the creator of this awesome website.</p>
          </StyledHeaderText>
        </StyledHeader>
        <StyledBody>
          {/* <div className="underline"></div> */}
          <StyledBodyText>
            <p>
              Hi, i'm Jordan. I created this website as a portfolio project to
              display my skill and technical proficiency in making its wide
              array of features work. From sorting data, to fetching data from
              my structured back-end database and everything in-between, it has
              all been coded by me from the ground up. I got the idea for this
              site because i love horror. Creepy pasta's can be a brilliant read
              and often creepier than any official horrors and i thought this
              would be a good way to get that same thing but for every genre
              from minds just as creative.
            </p>
            <p>
              It had been a little while since my last major project so this was
              also a way for me to get back into the swing of things and refresh
              myself on things i had forgotten. As well as tackle new challenges
              that keep me always learning new things and improving as a
              developer. I do also want to mention that a lot of the design of
              this site was coopted from different existing sites. Im not a
              professional designer but i did want this to look professional and
              so ive taken inspiration from multiple designs to get this.
            </p>
            <p>
              I am also looking for work so if you like what you see here please
              reach out, you can find my portfolio along with all contact info{" "}
              <a
                href="https://jordan-gidman-portfolio.netlify.app/"
                target="_blank"
              >
                Here
              </a>
              . I believe i could make an excellent addition to your front-end
              family.
            </p>
          </StyledBodyText>
        </StyledBody>
      </StyledWrapper>
      {/* <Footer /> */}
    </StyledAbout>
  );
}

export default About;
