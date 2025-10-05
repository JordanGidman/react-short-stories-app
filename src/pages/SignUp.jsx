// import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import styled from "styled-components";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import InputBox from "../components/InputBox";
import { doc, setDoc } from "firebase/firestore";

//Styled components
const StyledContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledH1 = styled.h1`
  font-size: 4.6rem;
  font-family: "Playfair Display", serif;
  font-weight: 900;
  margin-bottom: 6rem;

  span {
    font-weight: 500;
    font-style: italic;
  }
`;
const StyledForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3rem;
  width: 50%;
`;
// const StyledInput = styled.input`
//   width: 50%;
//   padding: 1rem 2rem;
//   text-transform: capitalize;
//   font-size: 1.6rem;
//   border: none;
//   border-bottom: 1px solid rgb(0, 0, 0, 0.2);
//   color: #1c1f2e;
//   &::placeholder {
//     color: rgb(0, 0, 0, 0.5);
//     font-style: italic;
//   }
// `;

const SigninButton = styled(Button)`
  margin-top: 6rem;
  margin-bottom: 2rem;
  width: 40%;
  align-self: center;
  font-weight: 700;
  transition: all 0.4s ease-in-out;
`;

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setIsLoading(true);

    const displayName = e.target[0].value; // Assuming the first input is for display name
    const fullName = e.target[1].value; // Assuming the first input is for display name

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
      });
      navigate("/", {
        state: { justSignedUp: true },
      });
      setIsLoading(false);
    } catch (err) {
      //replace with proper error handling later
      console.log(err.message);
    }
  }

  return (
    <StyledContainer>
      <Navbar />
      <StyledH1>
        Sign up <span>for free</span>
      </StyledH1>
      {!isLoading ? (
        <StyledForm onSubmit={handleSignUp}>
          <InputBox type="text" placeholder="* Display Name" />
          <InputBox type="text" placeholder="* Full Name" />
          <InputBox type="email" placeholder="* Email" />
          <InputBox type="password" placeholder="* Password" />
          <SigninButton disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </SigninButton>
        </StyledForm>
      ) : (
        <Spinner />
      )}
    </StyledContainer>
  );
}

export default SignUp;
