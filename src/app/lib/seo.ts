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
};

/** Sets document title + meta description/OG/canonical per page, per language. */
export function useSeo({ title, description, path = "" }: SeoInput) {
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
  }, [language, title, description, path]);
}
