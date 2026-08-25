import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Live Google rating for the author card.
 *
 * The rating is fetched from the `google-reviews` Edge Function, which calls
 * the Google Places API server-side (so the API key never reaches the browser)
 * and caches the result. Until that function + its secrets are configured, keep
 * GOOGLE_REVIEWS_ENABLED = false and the badge simply doesn't render — we never
 * show a made-up number.
 *
 * To go live:
 *   1) Deploy supabase/functions/google-reviews (see that file's header).
 *   2) supabase secrets set GOOGLE_PLACES_API_KEY=... GOOGLE_PLACE_ID=...
 *   3) Flip GOOGLE_REVIEWS_ENABLED to true.
 */
export const GOOGLE_REVIEWS_ENABLED = true;

export type GoogleReviews = { rating: number; total: number; url: string };

export function useGoogleReviews(): GoogleReviews | null {
  const [data, setData] = useState<GoogleReviews | null>(null);

  useEffect(() => {
    if (!GOOGLE_REVIEWS_ENABLED || !isSupabaseConfigured) return;
    let alive = true;
    supabase.functions
      .invoke("google-reviews")
      .then(({ data, error }) => {
        if (!alive || error || !data || typeof data.rating !== "number") return;
        setData({
          rating: data.rating,
          total: typeof data.total === "number" ? data.total : 0,
          url: typeof data.url === "string" ? data.url : "",
        });
      })
      .catch(() => {
        /* network/config error — leave the badge hidden */
      });
    return () => {
      alive = false;
    };
  }, []);

  return data;
}
