import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";

const StyledContainer = styled.div``;
const StyledWrapper = styled.div``;
const StyledSubheading = styled.span``;
const StyledForm = styled.form``;
const StyledInput = styled.input``;

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
      <StyledWrapper>
        <h1 className="logo">Tell your story</h1>
        <StyledSubheading>Sign In</StyledSubheading>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput type="email" placeholder="Email"></StyledInput>
          <StyledInput
            type="password"
            className="signup-inputs"
            placeholder="password"
          ></StyledInput>
          <button className="sign-up-form-btn" disabled={isLoading}>
            Sign in
          </button>
          {error && <span>Something went wrong..</span>}
        </StyledForm>
        <p className="signup-footer">
          Don't have an account? <Link to={"/signup"}>Sign up</Link>
        </p>
      </StyledWrapper>
    </StyledContainer>
  );
}

export default SignIn;
