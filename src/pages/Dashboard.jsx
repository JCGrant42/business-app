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

      if (!mounted) return;

      const allowed = dashboards?.some(
        (c) => c.company_id === companyId
      );

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
