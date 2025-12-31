import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session, dashboards = [] }) {
  const navigate = useNavigate();
  const { companyId } = useParams(); // /dashboard/:companyId

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate("/");
  };

  // Find the currently active dashboard from the URL
  const activeDashboard =
    dashboards.find(d => d.company_id === companyId) || dashboards[0] || null;

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
      {session && (
        <>
          {dashboards.length === 0 && (
            <button
              onClick={() => {
                localStorage.setItem(
                  "postLoginRedirect",
                  "/create-dashboard"
                );
                navigate("/create-dashboard");
              }}
            >
              Create Dashboard
            </button>
          )}

          {dashboards.length === 1 && activeDashboard && (
            <span>{activeDashboard.company_name}</span>
          )}

          {dashboards.length > 1 && activeDashboard && (
            <select
              value={activeDashboard.company_id}
              onChange={(e) =>
                navigate(`/dashboard/${e.target.value}`)
              }
            >
              {dashboards.map((d) => (
                <option key={d.company_id} value={d.company_id}>
                  {d.company_name}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      {/* RIGHT */}
      {!session ? (
        <>
          <button
            onClick={() => {
              localStorage.setItem(
                "postLoginRedirect",
                "/create-dashboard"
              );
              navigate("/login");
            }}
          >
            Create Dashboard
          </button>
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/")}>
            Marketing Page
          </button>
          <button onClick={logout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
