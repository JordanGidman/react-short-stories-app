import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChanges(isDirty) {
  useEffect(() => {
    if (!isDirty) return;

    //Warn user on refresh/tab close
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  //Block app navigation
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page? If you want to save your changes click cancel and save story to drafts."
      );

      confirm ? blocker.proceed() : blocker.reset();
    }
  }, [blocker]);
}
