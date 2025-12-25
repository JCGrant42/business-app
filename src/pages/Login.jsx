import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider, redirectTo = "/") => {
    try {
      // 1️⃣ Clear any existing session
      await supabase.auth.signOut({ redirectTo: window.location.origin });

      // 2️⃣ Save the redirect path (e.g., dashboard creation) in localStorage
      localStorage.setItem("postLoginRedirect", redirectTo);

      // 3️⃣ Get the OAuth URL with prompt to force account selection
      const { data, error } = supabase.auth.getUrlForProvider(provider, {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      });

      if (error) {
        console.error("Error getting OAuth URL:", error);
        return;
      }

      // 4️⃣ Redirect the browser to the provider's OAuth page
      window.location.href = data.url;
    } catch (err) {
      console.error("Login failed:", err);
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
