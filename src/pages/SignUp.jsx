// import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import styled from "styled-components";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import InputBox from "../components/InputBox";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import signuphero from "../img/signup-hero.jpg";

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
  margin-bottom: 6rem;

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

  span {
    font-weight: 500;
    font-style: italic;
  }

  /* 440px */
  @media (max-width: 27.5em) {
    font-size: 3.6rem;
  }
`;

const StyledImg = styled.img`
  /* background-image: url(${signuphero});
  background-size: cover;
  background-position: center; */

  width: 85%;
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
  async function handleSignUp(e) {
    e.preventDefault();
    setIsLoading(true);

    const displayName = e.target[0].value; // Assuming the first input is for display name
    const fullName = e.target[1].value;

    const email = e.target[2].value;
    const password = e.target[3].value;

    //Might need to create a user in the DB also for saving their stories.
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
      });

      //Create a user in the db
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        displayName: displayName,
        fullName,
        stories: [],
        drafts: [],
      });
      navigate("/", {
        state: { justSignedUp: true },
      });
      setIsLoading(false);
    } catch (err) {
      //replace with proper error handling later
      console.log(err.message);
      setError(error);
      toast.error(`Error: ${error.message}`);
    }
  }
  return (
    <StyledContainer>
      <Navbar />
      <SecondWrapper>
        <StyledImg src={signuphero} alt="Sign Up Hero" loading="lazy" />
      </SecondWrapper>
      <StyledWrapper>
        <StyledH1>
          Welcome <span>Back!</span>
        </StyledH1>
        <StyledSubheading>Sign Up ↓</StyledSubheading>

        <StyledForm onSubmit={handleSignUp}>
          <StyledInputBox type="text" placeholder="* Display Name" />
          <StyledInputBox type="text" placeholder="* Full Name" />
          <StyledInputBox type="email" placeholder="* Email" />
          <StyledInputBox type="password" placeholder="* Password" />
          <SigninButton disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </SigninButton>
          {error && <span>Something went wrong..</span>}
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
