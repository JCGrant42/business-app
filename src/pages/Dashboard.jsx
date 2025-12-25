import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/login");
        return;
      }

      const { data } = await supabase.functions.invoke("login-bootstrap");
      const allowed = data?.some((c) => c.company_id === companyId);

      if (!allowed) {
        navigate("/no-access");
      }
    };

    verify();
  }, [companyId, navigate]);

  return <h1>Dashboard {companyId}</h1>;
}
