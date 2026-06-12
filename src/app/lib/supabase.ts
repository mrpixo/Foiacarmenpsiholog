import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once the Supabase project credentials are configured in `.env`. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Shared Supabase client. The anon key is safe to ship to the browser — access
 * is controlled by Row-Level Security (public can read published articles only;
 * the authenticated admin can do everything).
 *
 * If env vars are missing we still export a client pointed at a dummy URL so the
 * app builds/runs; the blog/admin pages show a "not configured" notice instead.
 */
export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
);
