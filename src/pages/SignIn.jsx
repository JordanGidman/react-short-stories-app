import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import InputBox from "../components/InputBox";
import Error from "../pages/Error";
import { toast } from "react-toastify";
import loginhero from "../img/login-hero.jpg";

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
  /* background-image: url(${loginhero});
  background-size: cover;
  background-position: center;

  height: 70%; */
  width: 85%;
`;

const StyledError = styled.span`
  width: 100%;
  color: red;
  text-align: center;
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

function SignIn() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    //capture all details at once. Not using controlled components in this case due to file upload

    const email = e.target[0].value;
    const password = e.target[1].value;

    //sign the user up through firebase authentication
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          console.log("User signed in:", user);
        },
      );
      navigate("/", {
        state: { justSignedIn: true },
      });
      setIsLoading(false);
    } catch (error) {
      setError(error);
      toast.error(`Error: ${error.message}`);
    }
  }

  return (
    <StyledContainer>
      <Navbar />
      <SecondWrapper>
        <StyledImg src={loginhero} alt="Login Hero" loading="lazy" />
      </SecondWrapper>
      <StyledWrapper>
        <StyledH1>
          Welcome <span>Back!</span>
        </StyledH1>
        <StyledSubheading>Sign In ↓</StyledSubheading>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInputBox type="email" placeholder="* Email" />
          <StyledInputBox type="password" placeholder="* Password" />
          <SigninButton disabled={isLoading}>Sign in</SigninButton>
          {error && <StyledError>Something went wrong..</StyledError>}
        </StyledForm>
        <StyledFooter>
          Don't have an account?{" "}
          <Link className="signup-link" to={"/signup"}>
            Sign up
          </Link>
        </StyledFooter>
      </StyledWrapper>
    </StyledContainer>
  );
}

export default SignIn;
