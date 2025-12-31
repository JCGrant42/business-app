import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard({ session, dashboards }) {
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      if (!session) {
        navigate("/login");
        return;
      }
      console.log("starting bootstrap");
      const { data, error } =
        await supabase.functions.invoke("login-bootstrap");
      console.log("bootstrap data:", data);
      if (!mounted) return;

      if (error) { //need to make sure that the user is still rejected if invalid
        console.log("bootstrap error:", error);
        navigate("/no-access");
        return;
      }

      const allowed = data?.some(
        (c) => c.company_id === companyId
      );
      console.log("is allowed:", allowed);

      if (!allowed) {
        navigate("/no-access");
      }
    };

    verifyAccess();

    return () => {
      mounted = false;
    };
  }, [companyId, navigate]);

  return <h1>Dashboard {companyId}</h1>;
}
