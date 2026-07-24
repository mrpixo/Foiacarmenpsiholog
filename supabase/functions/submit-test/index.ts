// Supabase Edge Function: submit-test
//
// Stores a completed psychological-test result and, once Resend is configured,
// emails the result to the user. Public/anonymous callers (people taking a
// test), so it must be deployed WITHOUT JWT verification.
//
// Deploy:   supabase functions deploy submit-test --no-verify-jwt
// Secrets:  supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//           supabase secrets set RESULTS_FROM="Carmen Foia <rezultate@psihologcarmenfoia.ro>"
//   (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
// Request body:
//   { slug, testName, score, band, message, locale, email?, marketingConsent? }
// Only slug/score/band/locale/email/marketing_consent are stored; testName and
// message are used only to render the email.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Body = {
  slug: string;
  testName?: string;
  score: number;
  band: string;
  message?: string;
  locale?: string;
  email?: string;
  marketingConsent?: boolean;
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;

    // Validation — this endpoint is public (no JWT) and sends email, so reject
    // anything that isn't a plausible test result.
    const KNOWN_SLUGS = new Set(["who-5", "gad-7", "phq-9", "rosenberg", "dass-21", "big-five"]);
    if (!KNOWN_SLUGS.has(body.slug)) throw new Error("unknown test");
    if (typeof body.score !== "number" || !Number.isFinite(body.score) || body.score < 0 || body.score > 200) {
      throw new Error("invalid score");
    }
    if (typeof body.band !== "string" || body.band.trim() === "" || body.band.length > 200) {
      throw new Error("invalid band");
    }

    const locale = body.locale === "en" ? "en" : "ro";
    const rawEmail = (body.email ?? "").trim().toLowerCase();
    if (rawEmail && (rawEmail.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail))) {
      throw new Error("invalid email");
    }
    const email = rawEmail || null;
    const marketing = body.marketingConsent === true;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Store the result (score + interpretation only).
    const { error: insErr } = await supabase.from("test_result").insert({
      slug: body.slug,
      score: Math.round(body.score),
      band: body.band,
      locale,
      email,
      marketing_consent: marketing,
    });
    if (insErr) throw new Error(insErr.message);

    // 2) Newsletter list — only with explicit marketing consent.
    if (email && marketing) {
      await supabase
        .from("subscriber")
        .upsert(
          { email, source: "test", marketing_consent: true, locale, updated_at: new Date().toISOString() },
          { onConflict: "email" },
        );
    }

    // 3) Email the result — dormant until RESEND_API_KEY is set.
    let emailed = false;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (email && resendKey) {
      const from = Deno.env.get("RESULTS_FROM") ?? "Carmen Foia <onboarding@resend.dev>";
      const heading = locale === "en" ? "Your result" : "Rezultatul tău";
      const subject = body.testName ? `${heading} — ${body.testName}` : heading;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;color:#39342e;max-width:560px;margin:0 auto">
          <p style="font-size:14px;color:#5c554d;margin:0 0 4px">${escapeHtml(body.testName ?? "")}</p>
          <p style="margin:0 0 8px"><span style="font-size:40px;font-weight:700;color:#006960">${Math.round(body.score)}</span></p>
          <p style="font-size:16px;font-weight:600;margin:0 0 12px">${escapeHtml(body.band)}</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 20px">${escapeHtml(body.message ?? "")}</p>
          <p style="font-size:12px;color:#888">${
            locale === "en"
              ? "This is a self-assessment tool, not a diagnosis."
              : "Acesta este un instrument de auto-evaluare, nu un diagnostic."
          }</p>
        </div>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [email], subject, html }),
      });
      emailed = r.ok;
    }

    return new Response(JSON.stringify({ ok: true, emailed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
