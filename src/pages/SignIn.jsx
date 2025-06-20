import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import InputBox from "../components/InputBox";

const SigninButton = styled(Button)`
  margin-top: 6rem;
  margin-bottom: 2rem;
  width: 60%;
  align-self: center;
  font-weight: 700;
`;

const StyledContainer = styled.div`
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
`;
const SecondWrapper = styled(StyledWrapper)`
  background-color: #85e9e1;
`;
const StyledSubheading = styled.span`
  font-size: 2.4rem;
  text-transform: uppercase;
  margin-bottom: 6rem;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 60%;
`;
// const StyledInput = styled.input`
//   padding: 1rem 2rem;
//   text-transform: capitalize;
//   font-size: 1.6rem;
//   border: none;
//   border-bottom: 1px solid rgb(0, 0, 0, 0.2);

//   &::placeholder {
//     color: rgb(0, 0, 0, 0.5);
//     font-style: italic;
//   }
// `;

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
`;

const StyledImg = styled.div`
  background-image: url(https://shortstoryproject.com/wp-content/uploads/2021/10/login-hero-3.jpg);
  background-size: cover;
  background-position: center;

  height: 70%;
  width: 65%;
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
  const [error, setError] = useState(false);
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
        }
      );
      navigate("/");
      setIsLoading(false);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  }

  return (
    <StyledContainer>
      <Navbar />
      <SecondWrapper>
        <StyledImg></StyledImg>
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
          {error && <span>Something went wrong..</span>}
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
