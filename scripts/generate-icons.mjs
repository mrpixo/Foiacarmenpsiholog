/**
 * Generates the site favicon/app-icon set into public/ from the round
 * HeaderLogoMark artwork (the illustrated portrait used in the navbar):
 *
 *   favicon.svg            — vector favicon (modern browsers)
 *   favicon.ico            — 16/32/48 PNG-compressed ICO (tabs, crawlers)
 *   apple-touch-icon.png   — 180×180 on the brand cream (iOS home screen)
 *   icon-192.png/-512.png  — Android/Chrome home screen (site.webmanifest)
 *
 * Run manually when the logo changes:  node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");

// ── Rebuild the HeaderLogoMark SVG from the imported Figma path data ─────────
const pathsSource = readFileSync(path.join(ROOT, "src/imports/Header/svg-txdvk9yxpl.ts"), "utf8");
const svgPaths = {};
for (const m of pathsSource.matchAll(/(p[0-9a-z]+):\s*"([^"]+)"/g)) svgPaths[m[1]] = m[2];

// Same layer order + fills as HeaderLogoMark in src/app/components/Navbar.tsx.
const LAYERS = [
  ["p2c848c00", "#0D121A"], ["p2deb6500", "#FFBA68"], ["p3476b270", "#FADFCF"],
  ["p22c43500", "#FADFCF"], ["p3940acc0", "#D32C26"], ["p7708400", "#0D121A"],
  ["p132f7570", "#FADFCF"], ["pdfb5280", "#FADFCF"], ["p17e6de00", "#0D121A"],
  ["p29ee0b00", "#FADFCF"], ["p124aff00", "#0D121A"], ["p5691e00", "#FFBA68"],
  ["p11cc3580", "#FFBA68"], ["pe3e0f00", "#FADFCF"], ["p32e31000", "#FADFCF"],
];

const markSvg = (size = "100%") => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" fill="#D9D9D9" r="31" stroke="#0D121A" stroke-width="2"/>
  <mask id="logo-mask" maskUnits="userSpaceOnUse" x="2" y="2" width="60" height="60">
    <circle cx="32" cy="32" fill="#D9D9D9" r="30"/>
  </mask>
  <g mask="url(#logo-mask)">
${LAYERS.map(([k, fill]) => `    <path d="${svgPaths[k]}" fill="${fill}"/>`).join("\n")}
  </g>
</svg>`;

async function main() {
  for (const [k] of LAYERS) if (!svgPaths[k]) throw new Error(`missing path ${k}`);

  // 1) Vector favicon.
  writeFileSync(path.join(PUBLIC, "favicon.svg"), markSvg());

  // 2) Rasterise with the project's puppeteer.
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();

  /** Screenshot the mark at `px`. Transparent bg, or solid bg with padding. */
  const shot = async (px, { bg = null, pad = 0 } = {}) => {
    await page.setViewport({ width: px, height: px, deviceScaleFactor: 1 });
    const inner = px - 2 * pad;
    await page.setContent(`<!doctype html><style>*{margin:0}body{width:${px}px;height:${px}px;display:grid;place-items:center;${bg ? `background:${bg}` : "background:transparent"}}svg{display:block}</style>${markSvg(`${inner}px`)}`);
    return page.screenshot({ type: "png", omitBackground: !bg });
  };

  const png16 = await shot(16);
  const png32 = await shot(32);
  const png48 = await shot(48);
  writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), await shot(180, { bg: "#f5eee9", pad: 14 }));
  writeFileSync(path.join(PUBLIC, "icon-192.png"), await shot(192, { bg: "#f5eee9", pad: 16 }));
  writeFileSync(path.join(PUBLIC, "icon-512.png"), await shot(512, { bg: "#f5eee9", pad: 42 }));
  await browser.close();

  // 3) Pack 16/32/48 PNGs into a single .ico (PNG-in-ICO, supported everywhere modern).
  const entries = [[16, png16], [32, png32], [48, png48]];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
  const dir = [];
  let offset = 6 + 16 * entries.length;
  for (const [size, buf] of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); // width
    e.writeUInt8(size === 256 ? 0 : size, 1); // height
    e.writeUInt16LE(1, 4);  // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += buf.length;
  }
  writeFileSync(path.join(PUBLIC, "favicon.ico"), Buffer.concat([header, ...dir, ...entries.map(([, b]) => b)]));

  // 4) Web app manifest for the Android/Chrome icons.
  writeFileSync(
    path.join(PUBLIC, "site.webmanifest"),
    JSON.stringify(
      {
        name: "Carmen Foia Psiholog",
        short_name: "Carmen Foia",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: "#006960",
        background_color: "#f5eee9",
        display: "browser",
      },
      null,
      2,
    ) + "\n",
  );

  console.log("[icons] wrote favicon.svg, favicon.ico, apple-touch-icon.png, icon-192/512.png, site.webmanifest");
}

main().catch((e) => {
  console.error("[icons] failed:", e);
  process.exit(1);
});
