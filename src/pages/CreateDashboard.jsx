import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CreateDashboard({ session, dashboards, setDashboards }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasTrial, setHasTrial] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!session) {
        navigate("/login?redirect=/create-dashboard");
        return;
      }
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
    
    if (data.success) {
      console.log(dashboards)
      console.log("attempting to add")
      const newArray = [...dashboards, data.dashboard];
      setDashboards(newArray);
      console.log(dashboards)

    }

    console.log(data)
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
