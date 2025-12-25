import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      const { data: sessionData } =
        await supabase.auth.getSession();

      if (!sessionData.session) {
        navigate("/login");
        return;
      }

      const { data, error } =
        await supabase.functions.invoke("login-bootstrap");

      if (!mounted) return;

      if (error) {
        navigate("/no-access");
        return;
      }

      const allowed = data?.some(
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
