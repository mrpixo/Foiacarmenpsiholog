import { supabase } from "./supabase";

export type TestSubmission = {
  slug: string;
  score: number;
  /** Stored: the canonical (English) band label or overall tone. */
  band: string;
  locale: string;
  email?: string;
  marketingConsent?: boolean;
  // Email-only display fields (not stored):
  testName: string;
  scoreMax?: number;
  bandLabel?: string;
  message: string;
  tone?: "good" | "moderate" | "concern";
};

/**
 * Send a completed result to the `submit-test` Edge Function, which stores it
 * and (once Resend is configured) emails the results. Safe to call before the
 * backend is deployed — errors are returned, never thrown, so the on-screen
 * result is never affected.
 */
export async function submitTest(
  payload: TestSubmission,
): Promise<{ ok: boolean; emailed?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("submit-test", { body: payload });
    if (error) return { ok: false, error: error.message };
    return { ok: true, emailed: (data as { emailed?: boolean } | null)?.emailed === true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown error" };
  }
}
