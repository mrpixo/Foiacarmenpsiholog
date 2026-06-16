/**
 * Whether the Supabase project credentials are configured.
 *
 * Lives in its own tiny module — with NO `@supabase/supabase-js` import — so
 * components can check configuration without pulling the ~54 KB client into the
 * initial bundle. The heavy client lives in `./supabase` and is loaded lazily.
 */
export const isSupabaseConfigured = Boolean(
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) &&
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined),
);
