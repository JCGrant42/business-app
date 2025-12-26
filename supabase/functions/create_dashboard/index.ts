import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Create a Supabase client using the service role (Edge Functions require it for admin operations)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const VERCEL_DOMAIN = "https://business-app-gray.vercel.app"; // update if needed

Deno.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Allow": "POST",
          "Access-Control-Allow-Origin": VERCEL_DOMAIN,
        },
      });
    }

    // Parse request body
    const { name: dashboardName, userId } = await req.json();
    if (!dashboardName || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing dashboard name or userId" }),
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": VERCEL_DOMAIN }, status: 400 }
      );
    }

    // 1️⃣ Check if user already has a trial dashboard
    const { data: existingDashboards, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .eq("status", "trial");

    if (fetchError) throw fetchError;

    if (existingDashboards?.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: "You already have a trial dashboard" }),
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": VERCEL_DOMAIN }, status: 400 }
      );
    }

    // 2️⃣ Insert new dashboard with 'trial' status
    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          company_name: dashboardName,
          owner_id: userId,
          status: "trial", // trial by default
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, dashboard: data }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": VERCEL_DOMAIN } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": VERCEL_DOMAIN }, status: 500 }
    );
  }
});
