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

      setHasTrial(
        data?.some((d) => d.status === "trial")
      );
    };
    console.error("0");
    init();
  }, [navigate]);
  console.error("5");
  const create = async () => {
    if (!name.trim()) return;
    console.error("6");
    setLoading(true);

    const { data, error }= await supabase.functions.invoke(
        "create_dashboard",
        {
            body: {
            name: name.trim()
            },
        }
    );
    console.error("1");
    console.error(data);
    console.error("2");

    setLoading(false);
    
    if (error) {
      console.error("3");
      console.error(error);
      console.error("4");
      alert(error.message);
      return;
    }

    navigate(`/dashboard/${data}`);
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
