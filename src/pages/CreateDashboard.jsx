import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CreateDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasTrial, setHasTrial] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } =
        await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate("/login?redirect=/create-dashboard");
        return;
      }

      const { data } =
        await supabase.functions.invoke("login-bootstrap");

    };

    init();
  }, [navigate]);

  const create = async () => {
    if (!name.trim()) return;
    setLoading(true);
    
    const { data, error }= await supabase.functions.invoke(
        "create_dashboard",
        {
            body: {
              name: name.trim()
            },
        }
    );
    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    console.log(data.dashboard.id)
    navigate(`/dashboard/${data.dashboard.id}`);
  };

  return (
    <div>
      <h1>Create Dashboard</h1>

      {hasTrial && (
        <p style={{ color: "red" }}>
          You already have a trial dashboard.
          Delete it before creating another.
        </p>
      )}

      <input
        placeholder="Dashboard name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={create}
        disabled={loading || hasTrial}
      >
        Create
      </button>
    </div>
  );
}
