import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  // 1️⃣ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 2️⃣ Enforce POST only
  if (req.method !== "POST") {
    return new Response("Not found", { status: 404 });
  }

  // 3️⃣ Read Authorization header safely
  const authHeader =
    req.headers.get("authorization") ||
    req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // 4️⃣ Create Supabase client using CORRECT secret names
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  // 5️⃣ Validate user from access token
  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return new Response("Invalid user", { status: 401 });
  }

  // 6️⃣ Call your stored procedure
  const { data, error } = await supabase.rpc(
    "on_login_claim_and_fetch_companies",
    {
      p_user_id: userData.user.id,
      p_email: userData.user.email,
    }
  );

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  // 7️⃣ Success
  return new Response(JSON.stringify(data), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
});
