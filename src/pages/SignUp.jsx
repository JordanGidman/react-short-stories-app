// import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    const displayName = e.target[0].value; // Assuming the first input is for display name
    const email = e.target[1].value;
    const password = e.target[2].value;

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

    await updateProfile(auth.currentUser, {
      displayName: displayName, // You can set a default display name or get it from the form
    });
    navigate("/");
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input type="text" placeholder="Display Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
