// Supabase Edge Function: google-reviews
//
// Returns Carmen's live Google rating for the author card, fetched from the
// Google Places API (New) *server-side* so the API key never reaches the
// browser. The result is cached in public.google_rating and refreshed at most
// once every CACHE_HOURS, so real Google traffic (and cost) stays negligible.
//
// Deploy:   supabase functions deploy google-reviews --no-verify-jwt
// Secrets:  supabase secrets set GOOGLE_PLACES_API_KEY=AIza...
//           supabase secrets set GOOGLE_PLACE_ID=ChIJ...
//   (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
// Google Cloud setup: enable "Places API (New)", create an API key, and
// (recommended) restrict that key to the Places API only.
//
// Response: { rating: number, total: number, url: string }
//   or { error: string } (HTTP 200) when not configured / unavailable — the
//   client treats a missing numeric rating as "hide the badge", never an error.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const CACHE_HOURS = 12;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    const placeId = Deno.env.get("GOOGLE_PLACE_ID");
    if (!apiKey || !placeId) return json({ error: "not configured" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Serve from cache while it is still fresh.
    const { data: cached } = await supabase
      .from("google_rating")
      .select("rating,total,url,fetched_at")
      .eq("id", 1)
      .maybeSingle();

    const isFresh =
      cached?.fetched_at &&
      Date.now() - new Date(cached.fetched_at).getTime() < CACHE_HOURS * 3600 * 1000;

    if (isFresh && typeof cached?.rating === "number") {
      return json({ rating: cached.rating, total: cached.total ?? 0, url: cached.url ?? "" });
    }

    // 2) Refresh from Google Places API (New).
    let rating: number | null = null;
    let total = 0;
    let url = "";
    try {
      const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri",
        },
      });
      if (r.ok) {
        const p = await r.json();
        if (typeof p.rating === "number") {
          rating = p.rating;
          total = typeof p.userRatingCount === "number" ? p.userRatingCount : 0;
          url = typeof p.googleMapsUri === "string" ? p.googleMapsUri : "";
        }
      } else {
        console.error("Places API error:", r.status, await r.text());
      }
    } catch (e) {
      console.error("Places API fetch failed:", (e as Error).message);
    }

    // 3) Persist and return; if the refresh failed, fall back to stale cache.
    if (rating !== null) {
      await supabase
        .from("google_rating")
        .upsert({ id: 1, rating, total, url, fetched_at: new Date().toISOString() });
      return json({ rating, total, url });
    }

    if (typeof cached?.rating === "number") {
      return json({ rating: cached.rating, total: cached.total ?? 0, url: cached.url ?? "" });
    }

    return json({ error: "unavailable" });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
