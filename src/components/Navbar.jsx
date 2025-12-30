import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session, dashboards }) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate("/");
  };

  const activeDashboard = dashboards?.[0] || null;

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {/* LEFT */}
      <button
        onClick={() => {
          if (activeDashboard) {
            navigate(`/dashboard/${activeDashboard.company_id}`);
          } else {
            navigate("/");
          }
        }}
      >
        Home
      </button>

      {/* DASHBOARD SELECTOR */}
      {session && dashboards.length > 0 && (
        <select
          value={activeDashboard?.company_id || ""}
          onChange={(e) => navigate(`/dashboard/${e.target.value}`)}
        >
          {dashboards.map((d) => (
            <option key={d.company_id} value={d.company_id}>
              {d.company_name}
            </option>
          ))}
        </select>
      )}

      {/* RIGHT */}
      {!session ? (
        <>
          <button
            onClick={() => {
              if (!session) {
                localStorage.setItem("postLoginRedirect", "/create-dashboard");
                navigate("/login");
              } else {
                navigate("/create-dashboard");
              }
            }}
          >
            Create Dashboard
          </button>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/")}>Marketing Page</button>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
