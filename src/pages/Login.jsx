import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";

export default function Login() {
  const location = useLocation();

  // Read redirect target from query string
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/";

  const signIn = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("google")}>Google</button>
      <button onClick={() => signIn("microsoft")}>Microsoft</button>
      <button onClick={() => signIn("apple")}>Apple</button>
    </div>
  );
}
