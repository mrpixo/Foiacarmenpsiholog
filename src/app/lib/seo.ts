import { useEffect } from "react";
import { useLanguage } from "../i18n";

const SITE_URL = "https://psihologcarmenfoia.ro";
const SUFFIX = "Carmen Foia — Psiholog Oradea";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

type SeoInput = {
  /** Localised page title (without the brand suffix). */
  title: { ro: string; en: string };
  description: { ro: string; en: string };
  /** Path part of the canonical URL, e.g. "/blog". */
  path?: string;
  /** Optional per-page JSON-LD (Article, FAQPage, BreadcrumbList, …). Injected
   *  into <head> and captured by the prerenderer for rich results / AI search. */
  jsonLd?: object | object[] | null;
};

/** Sets/removes the per-page JSON-LD <script> (id'd so it's replaced, not piled up). */
function setJsonLd(data: object | object[] | null | undefined) {
  const id = "page-jsonld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export { SITE_URL };

/** Sets document title + meta description/OG/canonical (+ optional JSON-LD) per page, per language. */
export function useSeo({ title, description, path = "", jsonLd = null }: SeoInput) {
  const { language } = useLanguage();
  useEffect(() => {
    const t = `${title[language]} | ${SUFFIX}`;
    const d = description[language];
    const url = `${SITE_URL}${path}`;

    document.title = t;
    document.documentElement.lang = language;
    setMeta("name", "description", d);
    setMeta("property", "og:title", t);
    setMeta("property", "og:description", d);
    setMeta("property", "og:url", url);
    setMeta("property", "og:locale", language === "ro" ? "ro_RO" : "en_US");
    setMeta("name", "twitter:title", t);
    setMeta("name", "twitter:description", d);
    setCanonical(url);
    setJsonLd(jsonLd);
    return () => setJsonLd(null);
  }, [language, title, description, path, jsonLd]);
}
