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

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [dashboards, setDashboards] = useState([]);
  const [bootstrapped, setBootstrapped] = useState(false);

  // 1️⃣ Bootstrap auth + dashboards
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);

      if (data.session) {
        const { data: dashboardsData, error } =
          await supabase.functions.invoke("login-bootstrap");

        if (!mounted) return;

        if (!error && dashboardsData) {
          setDashboards(dashboardsData);
        }
      }

      setBootstrapped(true);
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

  // 2️⃣ First-visit redirect logic
  useEffect(() => {
    if (!bootstrapped) return;
    if (!session) return;

    const firstVisit =
      !sessionStorage.getItem("initialRedirectDone");

    if (!firstVisit) return;

    sessionStorage.setItem("initialRedirectDone", "true");

    if (
      location.pathname === "/" &&
      dashboards.length > 0
    ) {
      navigate(`/dashboard/${dashboards[0].company_id}`, {
        replace: true,
      });
    }
  }, [
    bootstrapped,
    session,
    dashboards,
    location.pathname,
    navigate,
  ]);

  // 3️⃣ Block rendering until bootstrap completes
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
        <Route path="/create-dashboard" element={<CreateDashboard />} />
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
