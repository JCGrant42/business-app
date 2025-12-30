import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import NoAccess from "./pages/NoAccess";
import CreateDashboard from "./pages/CreateDashboard";

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [dashboards, setDashboards] = useState([]);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(data.session);

        if (data.session) {
          const { data: dashboardsData, error } =
            await supabase.functions.invoke("login-bootstrap");

          if (!mounted) return;

          const dashboardsSafe = dashboardsData ?? [];
          setDashboards(dashboardsSafe);

          const redirectTo =
            localStorage.getItem("postLoginRedirect");

          if (redirectTo) {
            localStorage.removeItem("postLoginRedirect");
            navigate(redirectTo, { replace: true });
            return;
          }

          if (dashboardsSafe.length > 0) {
            navigate(
              `/dashboard/${dashboardsSafe[0].company_id}`,
              { replace: true }
            );
            return;
          }
        }
      } catch (err) {
        console.error("Bootstrap error:", err);
      } finally {
        if (mounted) {
          setBootstrapped(true);
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 3️⃣ Block render until ready
  if (!bootstrapped) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar
        session={session}
        dashboards={dashboards}
      />

      <Routes>
        <Route
          path="/"
          element={<Home session={session} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/:companyId"
          element={<Dashboard />}
        />
        <Route
          path="/create-dashboard"
          element={<CreateDashboard  
            session={session}
            dashboards={dashboards}
            setDashboards={setDashboards}
          />}
        />
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <>
      <AppInner />
    </>
  );
}
