// Supabase Edge Function: trigger-deploy
//
// Fires the Vercel deploy hook so the site rebuilds (and re-prerenders) after
// content is published or unpublished from the admin CMS. Without this, new
// articles stay invisible to crawlers until someone redeploys by hand.
//
// Deploy:   via the Supabase dashboard editor, with "Verify JWT" left ON.
// Secrets:  VERCEL_DEPLOY_HOOK_URL — Vercel → Project → Settings → Git →
//           Deploy Hooks → create one for `main` and paste its URL.
//   (SUPABASE_URL and SUPABASE_ANON_KEY are injected automatically.)
//
// Security: the gateway's JWT check also passes for the public anon key, so we
// additionally require the token to belong to a real signed-in user — the CMS
// admin is the only account in Supabase Auth.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return json({ error: "not authorised" }, 401);

    const hook = Deno.env.get("VERCEL_DEPLOY_HOOK_URL");
    if (!hook) {
      console.error("VERCEL_DEPLOY_HOOK_URL is not set — rebuild skipped");
      return json({ ok: false, error: "not configured" });
    }

    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) {
      console.error("Deploy hook failed:", res.status, await res.text());
      return json({ ok: false }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
