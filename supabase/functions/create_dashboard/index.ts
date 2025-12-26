import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const VERCEL_DOMAIN = "https://business-app-gray.vercel.app";
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": VERCEL_DOMAIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  try {
    // ✅ Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const { name: dashboardName, userId } = await req.json();
    if (!dashboardName || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing dashboard name or userId" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const { data: existingDashboards, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .eq("status", "trial");

    if (fetchError) throw fetchError;

    if (existingDashboards?.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: "You already have a trial dashboard" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("companies")
      .insert([{ company_name: dashboardName, owner_id: userId, status: "trial" }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, dashboard: data }), { headers: corsHeaders });

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
