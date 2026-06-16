import type { Language } from "../i18n";

/**
 * Types, pure formatters and string utilities for articles — no Supabase
 * import, so render-path components (cards) can use these without pulling the
 * client into the initial bundle. DB calls live in `./articles`.
 */

export type Category = {
  id: string;
  slug: string;
  name_ro: string;
  name_en: string;
};

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  slug: string;
  status: ArticleStatus;
  category_id: string | null;
  read_minutes: number;
  title_ro: string;
  title_en: string;
  excerpt_ro: string;
  excerpt_en: string;
  body_ro: string;
  body_en: string;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export type ArticleInput = {
  slug: string;
  category_id: string | null;
  read_minutes: number;
  title_ro: string;
  title_en: string;
  excerpt_ro: string;
  excerpt_en: string;
  body_ro: string;
  body_en: string;
  cover_url: string | null;
};

/** Localised helpers. */
export const catName = (c: Category | null | undefined, lang: Language) =>
  c ? (lang === "ro" ? c.name_ro : c.name_en) : "";
export const title = (a: Article, lang: Language) => (lang === "ro" ? a.title_ro : a.title_en);
export const excerpt = (a: Article, lang: Language) => (lang === "ro" ? a.excerpt_ro : a.excerpt_en);
export const body = (a: Article, lang: Language) => (lang === "ro" ? a.body_ro : a.body_en);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Estimate reading time from HTML body (~200 words/min). */
export function estimateReadMinutes(...htmlBodies: string[]): number {
  const words = htmlBodies
    .map((h) => h.replace(/<[^>]+>/g, " ").trim())
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
