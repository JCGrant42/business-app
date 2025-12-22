import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return <h1>Dashboard (Logged In)</h1>;
}
