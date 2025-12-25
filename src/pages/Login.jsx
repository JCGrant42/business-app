import { supabase } from "../supabaseClient";

export default function Login() {
  const signIn = async (provider) => {
    // Force logout to ensure user chooses an account
    await supabase.auth.signOut({ redirectTo: "/" });

    // Wait a tiny bit for logout to clear session
    setTimeout(async () => {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
    }, 500);
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
