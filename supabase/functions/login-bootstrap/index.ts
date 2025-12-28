import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { supabase, corsHeaders, handlePreflight, jsonResponse } from "./_helper.ts";

serve(async (req) => {
  // 1️⃣ Handle preflight OPTIONS
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  // 2️⃣ Enforce POST only
  //if (req.method !== "POST") {
  return new Response("Not Found", { status: 404, headers: corsHeaders });
  //}

  // 3️⃣ Read Authorization header safely
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const token = authHeader.replace("Bearer ", "").trim();

  // 4️⃣ Validate user from access token
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return new Response("Invalid user", { status: 401, headers: corsHeaders });
  }

  // 5️⃣ Call stored procedure
  const { data, error } = await supabase.rpc(
    "on_login_claim_and_fetch_companies",
    {
      p_user_id: userData.user.id,
      p_email: userData.user.email,
    }
  );

  if (error) {
    return new Response(JSON.stringify(error), { status: 500, headers: corsHeaders });
  }

  // 6️⃣ Success
  return jsonResponse(data);
});
