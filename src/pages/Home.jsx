import { useNavigate } from "react-router-dom";

export default function Home({ session }) {
  const navigate = useNavigate(); // ✅ move inside the component

  return (
    <div>
      <h1>Welcome</h1>

      {!session ? (
        <p>Welcome — please log in or create a dashboard.</p>
      ) : (
        <p>
          You are logged in. Use the navigation bar to access your dashboards or
          return here via the menu.
        </p>
      )}

      {session && (
        <button onClick={() => navigate("/create-dashboard")}>
          Create Dashboard
        </button>
      )}
    </div>
  );
}
