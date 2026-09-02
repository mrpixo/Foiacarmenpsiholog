import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Ask the `trigger-deploy` Edge Function to fire the Vercel deploy hook, so a
 * fresh build re-prerenders the site — newly published (or unpublished)
 * articles reach crawlers and the sitemap without a manual redeploy.
 *
 * Fire-and-forget: publishing must never fail because the rebuild couldn't be
 * triggered, so errors are only logged.
 */
export function triggerDeploy(): void {
  if (!isSupabaseConfigured) return;
  supabase.functions
    .invoke("trigger-deploy")
    .then(({ error }) => {
      if (error) console.warn("trigger-deploy failed:", error.message);
      else console.info("Site rebuild triggered — the change goes live for crawlers in ~2 minutes.");
    })
    .catch((e) => console.warn("trigger-deploy failed:", e));
}
