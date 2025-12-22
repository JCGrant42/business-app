import { supabase } from "../supabaseClient";

export default function Home() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Business App</h1>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}
