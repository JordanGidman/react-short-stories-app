import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (email, password) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed up:", user);

      // await updateProfile(userCredential.user, {
      //   displayName,
      // });

      // await setDoc(doc(db, "users", userCredential.user.uid), {
      //   uid: userCredential.user.uid,
      //   displayName,
      //   email,
      //   admin: false,
      // });

      // await signInWithEmailAndPassword(auth, email, password).then(
      //   (userCredential) => {
      //     const user = userCredential.user;
      //     console.log("User signed in:", user);
      //   }
      // );
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div>
      <h1>SignUp</h1>
      <form>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          disabled={isLoading}
          onChange={(e) => setDisplayName(e.target.value)}
          name="displayName"
          autoComplete="on"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          autoComplete="on"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          autoComplete="on"
        />
        <button
          onSubmit={() => handleSignUp(email, password, displayName, navigate)}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;

// Fix bug where the button does not call the handleSignUp function correctly and for some reason puts the sign in details in the url
