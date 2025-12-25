import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ session }) {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);

  useEffect(() => {
    if (!session) return;

    supabase.functions.invoke("login-bootstrap").then(({ data }) => {
      setDashboards(data || []);
      setActiveDashboard(data?.[0] || null);
    });
  }, [session]);

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav>
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
            <button onClick={() => navigate("/login")}>
              Create Dashboard
            </button>
          )}

          {dashboards.length === 1 && (
            <span>{dashboards[0].company_name}</span>
          )}

          {dashboards.length > 1 && (
            <select
              onChange={(e) => {
                const d = dashboards.find(
                  (x) => x.company_id === e.target.value
                );
                setActiveDashboard(d);
                navigate(`/dashboard/${d.company_id}`);
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
          {/* <button onClick={() => navigate("/")}>Home</button> */}
          <button onClick={() => navigate("/login")}>Create Dashboard</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      ) : (
        <div>
          <button onClick={() => navigate("/")}>Marketing Page</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
