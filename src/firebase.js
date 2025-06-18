import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCaN_ovEZWJpaaGQrWI8tBo8fk9dpc657s",
  authDomain: "react-short-story-app.firebaseapp.com",
  projectId: "react-short-story-app",
  storageBucket: "react-short-story-app.firebasestorage.app",
  messagingSenderId: "170873320332",
  appId: "1:170873320332:web:e08a989227221b4e1a5ca9",
  measurementId: "G-7P9E6C09QD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app);

export { app, analytics, auth, db };
