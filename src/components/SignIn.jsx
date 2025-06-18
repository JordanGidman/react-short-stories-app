function SignIn({ auth, firebase }) {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="login-container">
      <button className="login-btn" onClick={signInWithGoogle}>
        Sign In
      </button>
    </div>
  );
}

export default SignIn;
