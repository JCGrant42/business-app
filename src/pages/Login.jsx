import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider) => {
    // Fully clear session from local storage
    await supabase.auth.signOut();

    // Build the OAuth URL manually to ensure prompt
    const { data } = supabase.auth.getUrlForProvider(provider, {
      redirectTo: `${window.location.origin}/`,
      queryParams: { prompt: "select_account" },
    });

    // Redirect manually to the OAuth provider
    window.location.href = data.url;
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
