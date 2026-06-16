import { supabase } from "./supabase";
import type { Category, Article, ArticleStatus, ArticleInput } from "./articles-format";

// Re-export types, formatters and pure utils so existing importers of
// "./articles" keep working unchanged.
export type { Category, Article, ArticleStatus, ArticleInput } from "./articles-format";
export { catName, title, excerpt, body, slugify, estimateReadMinutes } from "./articles-format";

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
