import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import NoAccess from "./pages/NoAccess";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar session={session} />
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:companyId" element={<Dashboard />} />
        <Route path="/no-access" element={<NoAccess />} />
      </Routes>
    </Router>
  );
}
