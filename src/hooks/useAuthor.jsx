import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useAuthor(story) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!story?.creatorID) return;

    async function fetchAuthor() {
      try {
        const snap = await getDoc(doc(db, "users", story.creatorID));
        if (snap.exists()) {
          setAuthor({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        // toast.error("Error fetching author data.");
        setError(err);
      }
    }

    fetchAuthor();
  }, [story?.creatorID]);

  return {
    author,
    loading,
    error,
  };
}
