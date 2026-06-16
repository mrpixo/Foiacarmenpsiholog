import type { Language } from "../i18n";

/**
 * Types and pure formatters for testimonials + FAQ — no Supabase import, so
 * render-path components can use these without pulling the client into the
 * initial bundle. DB calls live in `./community`.
 */

// ── Testimonials (single language) ───────────────────────────────────────────
export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  published: boolean;
  created_at: string;
};

// ── FAQ (bilingual) ──────────────────────────────────────────────────────────
export type Faq = {
  id: string;
  question_ro: string;
  question_en: string;
  answer_ro: string;
  answer_en: string;
  category_ro: string;
  category_en: string;
  show_on_homepage: boolean;
  published: boolean;
  created_at: string;
};

export type FaqInput = {
  question_ro: string;
  question_en: string;
  answer_ro: string;
  answer_en: string;
  category_ro: string;
  category_en: string;
  show_on_homepage: boolean;
};

export const faqQuestion = (f: Faq, lang: Language) => (lang === "ro" ? f.question_ro : f.question_en);
export const faqAnswer = (f: Faq, lang: Language) => (lang === "ro" ? f.answer_ro : f.answer_en);
export const faqCategory = (f: Faq, lang: Language) => (lang === "ro" ? f.category_ro : f.category_en);
