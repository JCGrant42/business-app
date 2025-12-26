import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase client
export const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!,
    {
        auth: {
        persistSession: false,
        },
    }
);

// CORS headers
export const VERCEL_DOMAIN = "https://business-app-gray.vercel.app";
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": VERCEL_DOMAIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

// Handle OPTIONS request
export function handlePreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return null;
}

// Helper to enforce POST method
export function enforcePost(req: Request): Response | null {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  return null;
}

// Standard JSON response with CORS headers
export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), { headers: corsHeaders, status });
}
