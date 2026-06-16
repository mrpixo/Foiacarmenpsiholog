import { supabase } from "./supabase";
import type { Testimonial, Faq, FaqInput } from "./community-format";

// Re-export types + formatters so existing importers of "./community" keep working.
export type { Testimonial, Faq, FaqInput } from "./community-format";
export { faqQuestion, faqAnswer, faqCategory } from "./community-format";

// ── Testimonials (single language) ───────────────────────────────────────────
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
