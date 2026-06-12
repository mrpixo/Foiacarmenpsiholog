// Supabase Edge Function: translate
//
// Translates blog content between Romanian and English using DeepL. The DeepL
// API key is stored as a Supabase secret (DEEPL_API_KEY) and never reaches the
// browser. Only authenticated callers reach this function (verify_jwt = true,
// the default), i.e. the logged-in admin.
//
// Deploy:  supabase functions deploy translate
// Secret:  supabase secrets set DEEPL_API_KEY=xxxxxxxx:fx   (":fx" = free tier)
//
// Request body: { source: "RO"|"EN", target: "RO"|"EN", plain: string[], html: string[] }
// Response:     { plain: string[], html: string[] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Body = {
  source: "RO" | "EN";
  target: "RO" | "EN";
  plain?: string[];
  html?: string[];
};

// DeepL wants a region for English; Romanian is just "RO".
const targetLang = (t: "RO" | "EN") => (t === "EN" ? "EN-GB" : "RO");

async function deepl(
  key: string,
  endpoint: string,
  texts: string[],
  source: string,
  target: string,
  html: boolean,
): Promise<string[]> {
  if (texts.length === 0) return [];
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: source,
      target_lang: targetLang(target as "RO" | "EN"),
      ...(html ? { tag_handling: "html" } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`DeepL ${res.status}: ${detail}`);
  }
  const data = await res.json();
  return (data.translations ?? []).map((t: { text: string }) => t.text);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const key = Deno.env.get("DEEPL_API_KEY");
    if (!key) throw new Error("DEEPL_API_KEY is not set");
    // Free-tier keys end with ":fx" and use the api-free host.
    const endpoint = key.endsWith(":fx")
      ? "https://api-free.deepl.com/v2/translate"
      : "https://api.deepl.com/v2/translate";

    const { source, target, plain = [], html = [] } = (await req.json()) as Body;
    if (!source || !target) throw new Error("source and target are required");

    const [plainOut, htmlOut] = await Promise.all([
      deepl(key, endpoint, plain, source, target, false),
      deepl(key, endpoint, html, source, target, true),
    ]);

    return new Response(JSON.stringify({ plain: plainOut, html: htmlOut }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
