import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Button from "./Button";

const StyledEditAccount = styled.div`
  /* height: 100%; */
`;

const StyledH1 = styled.h1`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(28, 31, 46, 0.8);
  padding-bottom: 2rem;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-style: italic;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  /* gap: 2rem; */
  min-height: 90%;

  width: 100%;
  /* min-height: 100%; */

  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
`;

const StyledField = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  align-items: center;
  width: 95%;
  /* gap: 2rem; */
  padding: 2rem 0rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StyledInput = styled.input`
  padding: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
`;

// Tooltip text
const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;

  position: absolute;
  bottom: 90%; /* show above button */
  left: 50%;
  transform: translateX(-50%);

  background-color: #1c1f2e;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  white-space: nowrap;

  z-index: 1;

  /* arrow, ill be honest i took this from the internet, thank you random person */
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

  ${StyledField}:hover & {
    visibility: visible;
    opacity: 1;
    .icon {
      font-size: 2.4rem;
    }
  }
`;

function EditAccount() {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("New Email");
  const [password, setPassword] = useState("New Password");

  console.log(currentUser);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setDisplayName(currentUser.displayName);
    setFullName(currentUser.fullName || "John Doe");
  }, [currentUser]);

  async function handleDetailsChange(e) {
    e.preventDefault();

    if (displayName !== currentUser.displayName) {
      //Update the displayName field on the db
      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName,
      });

      //Show toast notification
    }

    if (fullName !== currentUser.fullName) {
      //Update the fullname Field on the db
      await updateDoc(doc(db, "users", currentUser.uid), {
        fullName,
      });

      //Show toast notification
    }

    if (email !== "New Email") {
      //Alert the user that this is a portfolio project and firebase auth requires real email verification to change email.
      alert(
        "Apologies but firebase auth requires real email verfication to change email and as this is a portfolio piece i do not expect users to use a real email."
      );
    }
    if (password !== "New Password") {
      //Alert the user that this is a portfolio project and firebase auth requires real email verification to change email.
      alert(
        "Apologies but firebase auth requires real email verfication to change password and as this is a portfolio piece i do not expect users to use a real email."
      );
    }
  }

  return (
    <StyledEditAccount>
      <StyledH1>Edit Account</StyledH1>
      <StyledForm onSubmit={(e) => handleDetailsChange(e)}>
        <StyledField>
          <p>Display Name: </p>
          <StyledInput
            type="text"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </StyledField>
        <StyledField>
          <p>Full Name: </p>
          <StyledInput
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </StyledField>
        <StyledField>
          <p>Email: </p>
          <StyledInput
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={true}
          />
          <Tooltip>
            Apologies but firebase auth requires real email verfication to
            change email and password and as this is a portfolio piece i do not
            expect users to use a real email. If you did you can delete your
            account at any time from this page.
          </Tooltip>
        </StyledField>
        <StyledField>
          <p>Password: </p>
          <StyledInput
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={true}
          />
          <Tooltip>
            Apologies but firebase auth requires real email verfication to
            change email and password and as this is a portfolio piece i do not
            expect users to use a real email. If you did you can delete your
            account at any time from this page.
          </Tooltip>
        </StyledField>
        <StyledButton>Submit</StyledButton>
      </StyledForm>
    </StyledEditAccount>
  );
}

export default EditAccount;
