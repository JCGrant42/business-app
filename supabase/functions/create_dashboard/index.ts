import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  supabase,
  handlePreflight,
  enforcePost,
  jsonResponse,
} from "./_helper.ts";

Deno.serve(async (req) => {
  try {
    // 1️ Handle CORS preflight
    const preflight = handlePreflight(req);
    if (preflight) return preflight;

    // 2️ Enforce POST
    const postCheck = enforcePost(req);
    if (postCheck) return postCheck;

    // 3️ Read Authorization header
    const authHeader =
      req.headers.get("authorization") ||
      req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // 4️ Resolve authenticated user
    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return jsonResponse({ error: "Invalid user" }, 401);
    }

    const userId = userData.user.id;

    // 5️ Parse request body
    const { name: dashboardName } = await req.json();

    if (!dashboardName) {
      return jsonResponse(
        { error: "Missing dashboard name" },
        400
      );
    }

    // 6️ Check for existing trial dashboard
    const { data: existingDashboards, error: fetchError } =
      await supabase
        .from("companies")
        .select("id")
        .eq("owner_user_id", userId)
        .eq("status", "trial");

    if (fetchError) throw fetchError;

    if (existingDashboards?.length > 0) {
      return jsonResponse(
        { error: "You already have a trial dashboard" },
        400
      );
    }

    // 7️ Insert new dashboard
    const { data, error } = await supabase
      .from("companies")
      .insert({
        company_name: dashboardName,
        owner_user_id: userId,
        created_by_user_id: userId,
        status: "trial",
      })
      .select()
      .single();

    if (error) throw error;

    // 8️ Success
    return jsonResponse({
      success: true,
      dashboard: data,
    });

  } catch (err) {
    return jsonResponse(
      { error: err.message ?? "Unknown error" },
      500
    );
  }
});
