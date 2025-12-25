import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
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
