import { supabase } from "./supabase";
import type { Language } from "../i18n";

// ── Testimonials (single language) ───────────────────────────────────────────
export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  published: boolean;
  created_at: string;
};

export async function listPublishedTestimonials(limit?: number): Promise<Testimonial[]> {
  let q = supabase.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTestimonial(input: { name: string; quote: string }): Promise<Testimonial> {
  const { data, error } = await supabase.from("testimonials").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(id: string, input: Partial<{ name: string; quote: string; published: boolean }>): Promise<void> {
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

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

export const faqQuestion = (f: Faq, lang: Language) => (lang === "ro" ? f.question_ro : f.question_en);
export const faqAnswer = (f: Faq, lang: Language) => (lang === "ro" ? f.answer_ro : f.answer_en);
export const faqCategory = (f: Faq, lang: Language) => (lang === "ro" ? f.category_ro : f.category_en);

export async function listPublishedFaq(limit?: number): Promise<Faq[]> {
  let q = supabase.from("faq").select("*").eq("published", true).order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/** FAQs flagged for the homepage (the "homepage category"). */
export async function listHomepageFaq(limit = 6): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("published", true)
    .eq("show_on_homepage", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listAllFaq(): Promise<Faq[]> {
  const { data, error } = await supabase.from("faq").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type FaqInput = {
  question_ro: string;
  question_en: string;
  answer_ro: string;
  answer_en: string;
  category_ro: string;
  category_en: string;
  show_on_homepage: boolean;
};

export async function createFaq(input: FaqInput): Promise<Faq> {
  const { data, error } = await supabase.from("faq").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateFaq(id: string, input: Partial<FaqInput & { published: boolean }>): Promise<void> {
  const { error } = await supabase.from("faq").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) throw error;
}
