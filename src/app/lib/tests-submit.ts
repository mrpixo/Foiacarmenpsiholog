import { supabase } from "./supabase";

export type TestSubmission = {
  slug: string;
  /** For the results email only — not stored. */
  testName: string;
  score: number;
  band: string;
  /** Interpretation text, for the results email only — not stored. */
  message: string;
  locale: string;
  email?: string;
  marketingConsent?: boolean;
};

/**
 * Send a completed result to the `submit-test` Edge Function, which stores it
 * and (once Resend is configured) emails the results. Safe to call before the
 * backend is deployed — errors are returned, never thrown, so the on-screen
 * result is never affected.
 */
export async function submitTest(
  payload: TestSubmission,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke("submit-test", { body: payload });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown error" };
  }
}
