import { supabase } from "./supabase";
import type { NewsItem, NewsStatus, NewsInput } from "./news-format";

// Re-export types + formatters so existing importers of "./news" keep working.
export type { NewsItem, NewsStatus, NewsInput } from "./news-format";
export { newsTitle, newsExcerpt, newsBody } from "./news-format";

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
