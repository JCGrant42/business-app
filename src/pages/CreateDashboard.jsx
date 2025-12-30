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
    console.log("1");
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("2");
    console.log("SESSION:", session);
    console.log("3");
    
    const { data, error }= await supabase.functions.invoke(
        "create_dashboard",
        {
            body: {
              name: name.trim()
            },
        }
    );
    console.log("4");
    setLoading(false);
    console.log(data);
    console.log("5");
    console.log(error);
    console.log("6");

    if (error) {
      console.error(error);
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
