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
  scoreMax?: number;
  band: string;
  bandLabel?: string;
  message?: string;
  tone?: "good" | "moderate" | "concern";
  locale?: string;
  email?: string;
  marketingConsent?: boolean;
};

const SITE = "https://psihologcarmenfoia.ro";

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
    if (rawEmail && (rawEmail.length > 200 || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(rawEmail))) {
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
      const en = locale === "en";
      const name = escapeHtml(body.testName ?? (en ? "test" : "test"));
      const tone = body.tone === "moderate" || body.tone === "concern" ? body.tone : "good";
      const tc = { good: { t: "#006960", bg: "#ebf3f2" }, moderate: { t: "#a86a12", bg: "#fff1e1" }, concern: { t: "#c0392b", bg: "#fbecea" } }[tone];

      const subject = en ? `Your ${body.testName ?? "test"} result` : `Rezultatul tău la testul ${body.testName ?? ""}`;
      const intro = en
        ? "Thank you for completing the test — here is your result:"
        : "Îți mulțumesc că ai completat testul — iată rezultatul tău:";
      const role = en ? "Clinical and educational psychologist" : "Psiholog clinician și educațional";
      const persuasive = en
        ? "A score is only a starting point. In a session we can explore together what lies behind it and how you can feel better — reaching out is a small but meaningful first step, and you don't have to figure it out alone."
        : "Un scor este doar un punct de plecare. Într-o ședință putem explora împreună ce se ascunde în spatele lui și cum te poți simți mai bine — un prim pas mic, dar important, și nu trebuie să îl faci singur(ă).";
      const cta = en ? "Book a session" : "Programează o ședință";
      const disc = en
        ? "This test is indicative and for information only — it is not a diagnosis. For a formal evaluation, please consult a specialist."
        : "Acest test are caracter orientativ și informativ — nu este un diagnostic. Pentru un rezultat formal, adresează-te unui specialist.";

      const resultBlock = body.scoreMax
        ? `<div style="background:${tc.bg};border-radius:16px;padding:24px;margin:0 0 22px">
             <div style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${tc.t};margin:0 0 10px">${name}</div>
             <div style="font-size:44px;font-weight:700;color:${tc.t};line-height:1">${Math.round(body.score)}<span style="font-size:16px;color:#5c554d;font-weight:400"> ${en ? "of" : "din"} ${body.scoreMax}</span></div>
             ${body.bandLabel ? `<div style="margin-top:12px"><span style="display:inline-block;background:#ffffff;color:${tc.t};font-weight:600;font-size:14px;padding:6px 14px;border-radius:999px">${escapeHtml(body.bandLabel)}</span></div>` : ""}
           </div>
           <p style="font-size:15px;line-height:1.7;color:#39342e;margin:0 0 24px">${escapeHtml(body.message ?? "")}</p>`
        : `<div style="background:${tc.bg};border-radius:16px;padding:22px 24px;margin:0 0 24px">
             <div style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${tc.t};margin:0 0 10px">${name}</div>
             <div style="color:${tc.t};font-weight:600;font-size:15px;line-height:1.6">${escapeHtml(body.message ?? "")}</div>
           </div>`;

      const html = `
        <div style="background:#f5eee9;padding:24px 12px;font-family:Inter,Arial,sans-serif">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px 28px;color:#39342e">
            <p style="font-size:15px;line-height:1.6;color:#5c554d;margin:0 0 20px">${intro}</p>
            ${resultBlock}
            <p style="font-size:15px;line-height:1.7;color:#5c554d;margin:0 0 26px">${persuasive}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 30px">
              <tr><td style="border-radius:999px;background:#ffba68">
                <a href="${SITE}/contact" style="display:inline-block;padding:14px 30px;font-size:16px;font-weight:600;color:#1f1d1b;text-decoration:none">${cta}</a>
              </td></tr>
            </table>
            <div style="border-top:1px solid #eee6df;padding-top:18px;margin:0 0 16px">
              <p style="font-size:14px;font-weight:700;color:#39342e;margin:0 0 2px">Carmen Foia</p>
              <p style="font-size:13px;color:#5c554d;margin:0 0 6px">${role}</p>
              <a href="${SITE}" style="font-size:13px;color:#006960;font-weight:600;text-decoration:none">psihologcarmenfoia.ro</a>
            </div>
            <p style="font-size:12px;line-height:1.5;color:#999;margin:0">${disc}</p>
          </div>
        </div>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [email], subject, html }),
      });
      emailed = r.ok;
      if (!r.ok) console.error("Resend send failed:", r.status, await r.text());
    } else if (email && !resendKey) {
      console.error("RESEND_API_KEY is not set — email skipped");
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
