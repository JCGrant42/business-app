import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider, redirectTo = "/") => {
    try {
      // Clear any existing session
      await supabase.auth.signOut();

      // Save where to redirect after login
      localStorage.setItem("postLoginRedirect", redirectTo);

      // Start OAuth login with forced account selection
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("Login failed:", error);
        return;
      }

      // The redirect happens automatically; no need for window.location.href
      console.log("Redirecting to OAuth provider...");
    } catch (err) {
      console.error("Login error:", err);
    }
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
