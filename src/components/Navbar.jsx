import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useMemo } from "react";

export default function Navbar({ session, dashboards = [] }) {
  const navigate = useNavigate();
  const { companyId } = useParams(); // URL uses company_id

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate("/");
  };

  /**
   * Resolve active dashboard from URL → dashboards
   * Falls back safely if data loads late or URL is missing
   */
  const activeDashboard = useMemo(() => {
    if (!dashboards.length) return null;

    return (
      dashboards.find(d => d.company_id === companyId) ||
      dashboards[0]
    );
  }, [dashboards, companyId]);

  const activeDashboardId = activeDashboard?.company_id || "";
  const activeDashboardName = activeDashboard?.company_name || "";

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {/* LEFT */}
      <button
        onClick={() => {
          if (activeDashboardId) {
            navigate(`/dashboard/${activeDashboardId}`);
          } else {
            navigate("/");
          }
        }}
      >
        Home
      </button>

      {/* DASHBOARD DISPLAY / SELECTOR */}
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

          {/* Single dashboard → plain text */}
          {dashboards.length === 1 && activeDashboardName && (
            <span>{activeDashboardName}</span>
          )}

          {/* Multiple dashboards → controlled select */}
          {dashboards.length > 1 && activeDashboardId && (
            <select
              value={activeDashboardId}
              onChange={(e) => {
                const newId = e.target.value;
                navigate(`/dashboard/${newId}`);
              }}
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
