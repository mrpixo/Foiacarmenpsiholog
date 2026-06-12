import { supabase } from "./supabase";
import type { Language } from "../i18n";

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

/** Localised helpers. */
export const catName = (c: Category | null | undefined, lang: Language) =>
  c ? (lang === "ro" ? c.name_ro : c.name_en) : "";
export const title = (a: Article, lang: Language) => (lang === "ro" ? a.title_ro : a.title_en);
export const excerpt = (a: Article, lang: Language) => (lang === "ro" ? a.excerpt_ro : a.excerpt_en);
export const body = (a: Article, lang: Language) => (lang === "ro" ? a.body_ro : a.body_en);

const ARTICLE_SELECT = "*, category:categories(*)";

// ── Categories ───────────────────────────────────────────────────────────────
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name_ro");
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(input: {
  slug: string;
  name_ro: string;
  name_en: string;
}): Promise<Category> {
  const { data, error } = await supabase.from("categories").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

// ── Public reads (published only, enforced by RLS) ───────────────────────────
export async function listPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  let q = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (article.category_id) q = q.eq("category_id", article.category_id);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

// ── Admin reads/writes (require authenticated session) ───────────────────────
export async function listAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

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

export async function createArticle(input: ArticleInput): Promise<Article> {
  const { data, error } = await supabase
    .from("articles")
    .insert({ ...input, status: "draft" })
    .select(ARTICLE_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id: string, input: Partial<ArticleInput>): Promise<Article> {
  const { data, error } = await supabase
    .from("articles")
    .update(input)
    .eq("id", id)
    .select(ARTICLE_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function setArticleStatus(id: string, status: ArticleStatus): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();
  const { error } = await supabase.from("articles").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

// ── Utilities ────────────────────────────────────────────────────────────────
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
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
