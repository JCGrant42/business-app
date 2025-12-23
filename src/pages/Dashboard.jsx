import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const init = async () => {
      // 1️⃣ Ensure session is loaded from URL fragment
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate("/");
        return;
      }

      // 2️⃣ CALL THE EDGE FUNCTION (THIS WAS MISSING)
      const { data, error } = await supabase.functions.invoke(
        "login-bootstrap"
      );

      if (error) {
        console.error("Edge function error:", error);
        return;
      }

      console.log("Companies returned:", data);
      setCompanies(data);
      setLoading(false);
    };

    init();
  }, [navigate]);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {companies.length === 0 ? (
        <p>No companies yet</p>
      ) : (
        <ul>
          {companies.map((c) => (
            <li key={c.company_id}>{c.company_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
