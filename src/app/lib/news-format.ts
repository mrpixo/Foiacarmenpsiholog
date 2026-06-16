import type { Language } from "../i18n";

/**
 * Types and pure formatters for news items — no Supabase import, so this can be
 * statically imported by render-path components (cards) without dragging the
 * client into the initial bundle. DB calls live in `./news`.
 */

export type NewsStatus = "draft" | "published";

export type NewsItem = {
  id: string;
  slug: string;
  status: NewsStatus;
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
};

export type NewsInput = {
  slug: string;
  title_ro: string;
  title_en: string;
  excerpt_ro: string;
  excerpt_en: string;
  body_ro: string;
  body_en: string;
  cover_url: string | null;
};

export const newsTitle = (n: NewsItem, lang: Language) => (lang === "ro" ? n.title_ro : n.title_en);
export const newsExcerpt = (n: NewsItem, lang: Language) => (lang === "ro" ? n.excerpt_ro : n.excerpt_en);
export const newsBody = (n: NewsItem, lang: Language) => (lang === "ro" ? n.body_ro : n.body_en);
