// import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import signuphero from "../img/signup-hero.webp";
import CountrySelect from "../components/CountrySelect";
import { faker } from "@faker-js/faker";

const SigninButton = styled(Button)`
  margin-top: 6rem;
  margin-bottom: 2rem;
  width: 60%;
  align-self: center;
  font-weight: 700;

  /* 440px */
  @media (max-width: 27.5em) {
    margin-top: 3rem;
  }
`;

const StyledContainer = styled.main`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledWrapper = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background-color: #fff;

  /* 1200px */
  @media (max-width: 75em) {
    height: 100vh;
    width: 100vw;
  }
`;
const SecondWrapper = styled(StyledWrapper)`
  display: flex;
  padding: 4rem;
  overflow: hidden;
  background-color: #85e9e1;

  /* 1200px */
  @media (max-width: 75em) {
    display: none;
  }
`;
const StyledSubheading = styled.span`
  font-size: 2.4rem;
  text-transform: uppercase;
  margin-bottom: 2rem;

  /* 440px */
  @media (max-width: 27.5em) {
    margin-bottom: 2rem;
  }
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 60%;

  /* 1200px */
  @media (max-width: 75em) {
    width: 90%;
  }

  /* 440px */
  @media (max-width: 27.5em) {
    width: 100%;
  }
`;

const StyledInputBox = styled(InputBox)`
  width: 100%;
`;
const StyledH1 = styled.h1`
  font-size: 4.6rem;
  font-family: "Playfair Display", serif;
  font-weight: 900;
  text-align: center;
  margin-top: 2rem;

  span {
    font-weight: 500;
    font-style: italic;
  }

  /* 440px */
  @media (max-width: 30em) {
    font-size: 3.6rem;
  }
`;

const StyledImg = styled.img`
  /* background-image: url(${signuphero});
  background-size: cover;
  background-position: center; */

  width: 85%;
`;

// Tooltip text
const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;

  position: absolute;
  bottom: 110%; /* show above button */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  /* white-space: nowrap; */

  z-index: 1;

  /* tooltip arrow */
  &::after {
    content: "";
    position: absolute;
    top: 100%; /* point downwards */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  .photo-input:hover & {
    visibility: visible;
    opacity: 1;
    .icon {
      font-size: 2.4rem;
    }
  }
`;

const StyledFooter = styled.p`
  color: rgb(0, 0, 0, 0.7);

  .signup-link {
    text-decoration: none;
    color: #1c1f2e;
    font-weight: 700;
    padding-left: 0.2rem;
    transition: all 0.3s ease-in-out;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("New Email");
  const [password, setPassword] = useState("New Password");
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  async function handleSignUp(
    e,
    country,
    displayName,
    fullName,
    email,
    password,
    isLoading,
    setIsLoading,
    setError,
    photoURL,
  ) {
    e.preventDefault();
    setIsLoading(true);

    if (!country || !displayName || !fullName || !email || !password) {
      setIsLoading(false);
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      console.log(password, confirmPassword);
      setIsLoading(false);
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    //Create a user in auth and in the DB for saving their stories.
    try {
      //Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed up:", user);

          // Redirect or perform other actions
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          setError(error);
          toast.error(`Error: ${error.message}`);
        });
      //Update user profile with display name
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        fullName: fullName,
        photoURL: photoURL || faker.image.personPortrait(),
      });

      //Create a user in the db
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        displayName: displayName,
        fullName,
        country,
        stories: [],
        drafts: [],
        photoURL:
          photoURL.length === 0 ? faker.image.personPortrait() : photoURL,
      });
      navigate("/", {
        state: { justSignedUp: true },
      });
      setIsLoading(false);
    } catch (err) {
      //replace with proper error handling later
      console.log(err.message);
      setError(error);
      toast.error(`Error: ${error?.message}`);
    }
  }
  return (
    <StyledContainer>
      {/* <Navbar /> */}
      <SecondWrapper>
        <StyledImg src={signuphero} alt="Sign Up Hero" loading="lazy" />
      </SecondWrapper>
      <StyledWrapper>
        <StyledH1>
          Welcome <span>fellow reader!</span>
        </StyledH1>
        <StyledSubheading>Sign Up ↓</StyledSubheading>

        <StyledForm
          onSubmit={(e) =>
            handleSignUp(
              e,
              country,
              displayName,
              fullName,
              email,
              password,
              isLoading,
              setIsLoading,
              setError,
              photoURL,
            )
          }
        >
          <StyledInputBox
            type="text"
            placeholder="* Display Name"
            name="displayName"
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <StyledInputBox
            type="text"
            placeholder="* Full Name"
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
          />
          <CountrySelect country={country} setCountry={setCountry} />
          <StyledInputBox
            type="email"
            placeholder="* Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="photo-input" style={{ position: "relative" }}>
            <StyledInputBox
              type="text"
              placeholder="* Photo URL"
              name="photoURL"
              onChange={(e) => setPhotoURL(e.target.value)}
            />
            <Tooltip>
              Firebase has pay-walled their storage buckets, so it must be a URL
              instead of an upload. If you leave this blank a random image will
              be generated for you.
            </Tooltip>
          </div>
          <StyledInputBox
            type="password"
            placeholder="* Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledInputBox
            type="password"
            placeholder="* Confirm Password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <SigninButton disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </SigninButton>
        </StyledForm>
        <StyledFooter>
          Already have an account?{" "}
          <Link className="signup-link" to={"/signin"}>
            Sign in
          </Link>
        </StyledFooter>
      </StyledWrapper>
    </StyledContainer>
  );
}

export default SignUp;
