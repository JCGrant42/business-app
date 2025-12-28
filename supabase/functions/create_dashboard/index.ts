import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase, handlePreflight, enforcePost, jsonResponse } from "../_helper.ts";

Deno.serve(async (req) => {
  try {
    // Handle preflight
    const preflight = handlePreflight(req);
    if (preflight) return preflight;

    // Enforce POST
    const postCheck = enforcePost(req);
    if (postCheck) return postCheck;

    // Get Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { success: false, error: "Missing authorization header" },
        401
      );
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader);

    if (authError || !user) {
      return jsonResponse(
        { success: false, error: "Unauthorized" },
        401
      );
    }

    // Parse body
    const body = await req.json();
    const { name: dashboardName } = body;

    if (!dashboardName) {
      return jsonResponse(
        { success: false, error: "Missing dashboard name" },
        400
      );
    }

    const userId = user.id;

    // Check for existing trial dashboard
    const { data: existingDashboards, error: fetchError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_user_id", userId)
      .eq("status", "trial");

    if (fetchError) throw fetchError;

    if (existingDashboards.length > 0) {
      return jsonResponse(
        { success: false, error: "You already have a trial dashboard" },
        400
      );
    }

    // Insert new dashboard
    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          company_name: dashboardName,
          owner_user_id: userId,
          created_by_user_id: userId,
          status: "trial",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return jsonResponse({ success: true, dashboard: data });

  } catch (err) {
    console.log("Caught error:", err);
    return jsonResponse(
      { success: false, error: err.message ?? "Internal error" },
      500
    );
  }
});
