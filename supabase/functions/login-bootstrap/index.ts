import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const token = authHeader.replace("Bearer ", "");

  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userData.user?.email) {
    return new Response("Invalid user", { status: 401 });
  }

  const { data, error } = await supabase.rpc(
    "on_login_claim_and_fetch_companies",
    {
      p_user_id: userData.user.id,
      p_email: userData.user.email
    }
  );

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
});
