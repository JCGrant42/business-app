import { useEffect } from "react";

export default function Home({ session, onFirstVisit }) {
  useEffect(() => {
    // Only care if the user is logged in
    if (!session) return;

    const firstVisit = !sessionStorage.getItem("homeVisited");

    if (firstVisit) {
      sessionStorage.setItem("homeVisited", "true");

      // Signal to parent (NavBar / App) that a first-visit redirect is allowed
      onFirstVisit?.();
    }
  }, [session, onFirstVisit]);

  return (
    <div>
      <h1>Welcome</h1>

      {!session ? (
        <p>Please log in or create a dashboard.</p>
      ) : (
        <p>Select a dashboard from the navigation bar.</p>
      )}
    </div>
  );
}
