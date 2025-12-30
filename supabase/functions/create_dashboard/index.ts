import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { supabase, corsHeaders, handlePreflight, jsonResponse } from "./_helper.ts";

serve(async (req) => {
  // 1️⃣ Handle preflight OPTIONS
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  // 2️⃣ Enforce POST only
  if (req.method !== "POST") {
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }

  // 3️⃣ Read Authorization header
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // 4️⃣ Validate user from access token
  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return new Response("Invalid user", {
      status: 401,
      headers: corsHeaders,
    });
  }

  const userId = userData.user.id;

  // 5️⃣ Parse request body
  const body = await req.json();
  const { name: dashboardName } = body;

  if (!dashboardName) {
    return jsonResponse(
      { error: "Missing dashboard name" },
      400
    );
  }

  // 6️⃣ Enforce one trial dashboard per user
  const { data: existing, error: fetchError } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_user_id", userId)
    .eq("status", "trial");

  if (fetchError) {
    return jsonResponse(fetchError, 502);
  }

  if (existing.length > 0) {
    return jsonResponse(
      { error: "User already has a trial dashboard" },
      400
    );
  }

  // 7️⃣ Insert new dashboard
  const { data: dashboard, error: insertError } = await supabase
    .from("companies")
    .insert({
      company_name: dashboardName,
      owner_user_id: userId,
      created_by_user_id: userId,
      status: "trial",
    })
    .select()
    .single();

  if (insertError) {
    return jsonResponse(insertError, 500);
  }

  // 8️⃣ Success
  return jsonResponse({
    success: true,
    dashboard,
  });
});
