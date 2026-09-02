/**
 * Static prerender step (runs after `vite build`).
 *
 * Serves the built `dist/` SPA, drives headless Chromium through every route
 * (static routes + dynamic blog/news slugs fetched from Supabase), waits for the
 * React app + async content to render, then writes the fully-rendered HTML back
 * to `dist/<route>/index.html`. Vercel serves those static files in preference
 * to the SPA fallback, so crawlers and AI engines get real content + per-page
 * <title>/meta/JSON-LD, and first paint shows content before the JS boots.
 *
 * Failures are non-fatal: on any error the script logs and exits 0 so the SPA
 * build still deploys.
 */
import http from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4188;

const STATIC_ROUTES = [
  "/",
  "/contact",
  "/blog",
  "/noutati",
  "/intrebari-frecvente",
  "/teste",
  "/teste/who-5",
  "/teste/gad-7",
  "/teste/phq-9",
  "/teste/rosenberg",
  "/teste/big-five",
  "/teste/dass-21",
  "/privacy",
  "/terms",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/** Read VITE_SUPABASE_* from process.env (Vercel) or .env (local) without a dependency. */
function readEnv() {
  const out = {};
  const envPath = path.join(ROOT, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  // process.env (e.g. Vercel project env vars) takes precedence.
  for (const k of ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]) {
    if (process.env[k]) out[k] = process.env[k];
  }
  return out;
}

/** Fetch published rows ({slug, updated_at}) for a table from Supabase REST (best-effort). */
async function fetchSlugs(env, table) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?status=eq.published&select=slug,updated_at`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.filter((r) => r.slug);
  } catch {
    return [];
  }
}

/**
 * Launch a headless browser. On Linux CI (e.g. Vercel) the build image lacks
 * Chrome's system shared libraries, so use the self-contained @sparticuz/chromium
 * build with puppeteer-core. Locally (macOS/Windows) use full puppeteer's
 * bundled Chrome.
 */
async function launchBrowser() {
  if (process.platform === "linux") {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    return puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless ?? "new",
    });
  }
  const puppeteer = (await import("puppeteer")).default;
  return puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
}

/** Minimal static server for dist/ with SPA fallback to the original index.html. */
function startServer(shellHtml) {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const filePath = path.join(DIST, urlPath);
      // Serve a real file if it exists (assets, robots.txt, images, …).
      if (urlPath !== "/" && existsSync(filePath)) {
        const s = await stat(filePath);
        if (s.isFile()) {
          res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
          res.end(await readFile(filePath));
          return;
        }
      }
      // Otherwise the SPA shell (client router takes over).
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(shellHtml);
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/** Scroll through the page so `whileInView` sections render before capture. */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 600);
        y += 600;
        if (y >= document.body.scrollHeight + 1200) {
          window.scrollTo(0, 0);
          resolve();
        } else {
          setTimeout(step, 60);
        }
      };
      step();
    });
  });
}

async function main() {
  if (!existsSync(path.join(DIST, "index.html"))) {
    console.error("[prerender] dist/index.html missing — run `vite build` first. Skipping.");
    process.exit(0);
  }

  const shellHtml = await readFile(path.join(DIST, "index.html"), "utf8");
  const env = readEnv();

  const [articleRows, newsRows] = await Promise.all([
    fetchSlugs(env, "articles"),
    fetchSlugs(env, "news"),
  ]);

  const lastmodByRoute = new Map();
  for (const r of articleRows) if (r.updated_at) lastmodByRoute.set(`/blog/${r.slug}`, r.updated_at.slice(0, 10));
  for (const r of newsRows) if (r.updated_at) lastmodByRoute.set(`/noutati/${r.slug}`, r.updated_at.slice(0, 10));

  const routes = [
    ...STATIC_ROUTES,
    ...articleRows.map((r) => `/blog/${r.slug}`),
    ...newsRows.map((r) => `/noutati/${r.slug}`),
  ];

  const server = await startServer(shellHtml);
  const browser = await launchBrowser();

  // Every route is prerendered, including "/" and "/contact". Third-party
  // scripts that pages inject at runtime (Cal.com embed, analytics) are
  // stripped from the captured HTML below, so they initialise fresh when the
  // real app boots instead of double-loading from the baked markup.
  const crawlRoutes = routes;

  let ok = 0;
  try {
    for (const route of crawlRoutes) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1280, height: 900 });
        // Pin the site language to Romanian before the app boots. Without this
        // the app's geo-IP detection runs from the build server (non-RO) and
        // the captured HTML comes out in English.
        await page.evaluateOnNewDocument(() => {
          try { localStorage.setItem("cf-lang", "ro"); } catch { /* ignore */ }
        });
        await page.goto(`http://localhost:${PORT}${route}`, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });
        // Wait until the app has mounted and set its <title>.
        await page.waitForFunction(
          () => document.querySelector("#root")?.children.length > 0,
          { timeout: 15000 },
        );
        await autoScroll(page);
        await new Promise((r) => setTimeout(r, 800)); // let entrance animations settle
        // Strip runtime-injected third-party scripts (Cal.com embed, GA, …) so
        // they can't double-initialise over the hydrating app. Keep the Vite
        // bundle (/assets/*) and JSON-LD blocks.
        await page.evaluate(() => {
          for (const s of Array.from(document.querySelectorAll("script"))) {
            if (s.type === "application/ld+json") continue;
            const src = s.getAttribute("src") || "";
            if (src.startsWith("/assets/")) continue;
            s.remove();
          }
        });
        const html = "<!DOCTYPE html>\n" + (await page.content()).replace(/^<!DOCTYPE html>\s*/i, "");

        const outDir = route === "/" ? DIST : path.join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, "index.html"), html, "utf8");
        ok++;
        console.log(`[prerender] ✓ ${route}`);
      } catch (e) {
        console.warn(`[prerender] ✗ ${route} — ${e.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Emit a complete sitemap including the dynamic article/news URLs.
  try {
    const SITE = "https://psihologcarmenfoia.ro";
    const priority = (r) => (r === "/" ? "1.0" : r === "/contact" ? "0.9" : r.includes("/") && r.length > 7 ? "0.6" : "0.7");
    const body = routes
      .map((r) => {
        const lastmod = lastmodByRoute.get(r);
        return `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>${priority(r)}</priority></url>`;
      })
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    await writeFile(path.join(DIST, "sitemap.xml"), xml, "utf8");
    console.log(`[prerender] sitemap.xml written (${routes.length} urls)`);
  } catch (e) {
    console.warn("[prerender] sitemap write failed:", e.message);
  }

  console.log(`[prerender] done: ${ok}/${crawlRoutes.length} routes`);
}

main().catch((e) => {
  console.error("[prerender] fatal (continuing with SPA build):", e.message);
  process.exit(0);
});
