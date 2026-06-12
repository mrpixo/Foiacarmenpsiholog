import { supabase } from "./supabase";
import type { Language } from "../i18n";

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

export const newsTitle = (n: NewsItem, lang: Language) => (lang === "ro" ? n.title_ro : n.title_en);
export const newsExcerpt = (n: NewsItem, lang: Language) => (lang === "ro" ? n.excerpt_ro : n.excerpt_en);
export const newsBody = (n: NewsItem, lang: Language) => (lang === "ro" ? n.body_ro : n.body_en);

// ── Public reads (published only, enforced by RLS) ───────────────────────────
export async function listPublishedNews(limit?: number): Promise<NewsItem[]> {
  let q = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ── Admin reads/writes (require authenticated session) ───────────────────────
export async function listAllNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

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

export async function createNews(input: NewsInput): Promise<NewsItem> {
  const { data, error } = await supabase.from("news").insert({ ...input, status: "draft" }).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateNews(id: string, input: Partial<NewsInput>): Promise<NewsItem> {
  const { data, error } = await supabase.from("news").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function setNewsStatus(id: string, status: NewsStatus): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();
  const { error } = await supabase.from("news").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}
