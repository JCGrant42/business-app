import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase, corsHeaders, handlePreflight, enforcePost, jsonResponse } from "../_helper.ts";

Deno.serve(async (req) => {
  try {
    // ✅ Handle preflight OPTIONS
    const preflight = handlePreflight(req);
    if (preflight) return preflight;

    // ✅ Enforce POST method
    const postCheck = enforcePost(req);
    if (postCheck) return postCheck;

    // 1️⃣ Parse request body
    const body = await req.json();
    console.log("Request body:", body);
    const { name: dashboardName, userId } = body
    if (!dashboardName || !userId) {
      return jsonResponse({ success: false, error: "Missing dashboard name or userId" }, 400);
    }
    
    // 2️⃣ Check if user already has a trial dashboard
    const { data: existingDashboards, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .eq("status", "trial");
    console.log("1");
    if (fetchError) throw fetchError;
    console.log("2");
    if (existingDashboards?.length > 0) {
      return jsonResponse({ success: false, error: "You already have a trial dashboard" }, 400);
    }

    // 3️⃣ Insert new dashboard with 'trial' status
    const { data, error } = await supabase
      .from("companies")
      .insert([{ company_name: dashboardName, owner_user_id: userId, created_by_user_id: userId, status: "trial" }])
      .select()
      .single();

    if (error) {
      console.log("Supabase insert error:", error);
      throw error;
    }
    console.log("Insert success:", data);
    // 4️⃣ Success
    return jsonResponse({ success: true, dashboard: data }, 200);

  } catch (err) {
    console.log("Caught error:", err);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
});
