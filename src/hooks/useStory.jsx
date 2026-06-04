import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useStory(id) {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const storyRef = doc(db, "stories", id);

    const unsub = onSnapshot(
      storyRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setStory({
            id: docSnap.id,
            ...docSnap.data(),
          });

          setError(null);
        } else {
          setError(new Error("Story not found."));
        }

        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [id]);

  return {
    story,
    loading,
    error,
  };
}
