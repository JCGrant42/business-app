import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider) => {
    try {
      // Clear existing session
      await supabase.auth.signOut();

      // Start OAuth login
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin, // OAuth redirect
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("Login failed:", error);
      }
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
