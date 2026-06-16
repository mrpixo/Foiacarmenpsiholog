import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { Clock, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import {
  getPublishedArticleBySlug,
  listRelatedArticles,
  catName,
  title,
  excerpt,
  body,
  type Article,
} from "../../lib/articles";
import { NotConfigured } from "./NotConfigured";
import { useSeo, SITE_URL } from "../../lib/seo";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: { back: "Toate articolele", related: "Articole similare", read: "min citire", notFound: "Articolul nu a fost găsit.", loading: "Se încarcă..." },
  en: { back: "All articles", related: "Related articles", read: "min read", notFound: "Article not found.", loading: "Loading..." },
};

function formatDate(iso: string | null, lang: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogArticle() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = copy[language];
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const jsonLd = useMemo(
    () =>
      article
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title(article, language),
            description: excerpt(article, language) || title(article, language),
            inLanguage: language,
            datePublished: article.published_at || undefined,
            dateModified: article.updated_at || article.published_at || undefined,
            image: article.cover_url || undefined,
            articleSection: article.category ? catName(article.category, language) : undefined,
            author: { "@type": "Person", name: "Carmen Foia", jobTitle: "Psiholog Clinician" },
            publisher: { "@type": "Organization", name: "Carmen Foia Psiholog", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
          }
        : null,
    [article, language, slug],
  );

  useSeo({
    title: article
      ? { ro: title(article, "ro"), en: title(article, "en") }
      : { ro: "Articol blog", en: "Blog article" },
    description: article
      ? { ro: excerpt(article, "ro") || title(article, "ro"), en: excerpt(article, "en") || title(article, "en") }
      : { ro: "Articol de blog — Carmen Foia, psiholog Oradea.", en: "Blog article — Carmen Foia, psychologist in Oradea." },
    path: slug ? `/blog/${slug}` : "/blog",
    jsonLd,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getPublishedArticleBySlug(slug)
      .then(async (a) => {
        setArticle(a);
        if (a) setRelated(await listRelatedArticles(a));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[820px]">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]"
          style={FONT}
        >
          <ArrowLeft size={16} /> {t.back}
        </Link>

        {!isSupabaseConfigured ? (
          <NotConfigured />
        ) : loading ? (
          <p className="text-[#5c554d]" style={FONT}>{t.loading}</p>
        ) : !article ? (
          <p className="text-[#5c554d]" style={FONT}>{t.notFound}</p>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
              {article.category && (
                <span className="rounded-full bg-[#006960]/8 px-3 py-1 font-semibold text-[#006960]" style={FONT}>
                  {catName(article.category, language)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[#a89f95]" style={FONT}>
                <Clock size={13} /> {article.read_minutes} {t.read}
              </span>
              <span className="text-[#a89f95]" style={FONT}>{formatDate(article.published_at, language)}</span>
            </div>

            <h1 className="text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.15 }}>
              {title(article, language)}
            </h1>

            {excerpt(article, language) && (
              <p className="mt-4 text-lg leading-8 text-[#5c554d]" style={FONT}>{excerpt(article, language)}</p>
            )}

            {article.cover_url && (
              <img src={article.cover_url} alt="" className="mt-8 w-full rounded-3xl object-cover" />
            )}

            <div
              className="blog-prose mt-8"
              style={FONT}
              // Body HTML is authored by the trusted admin via the CMS editor.
              dangerouslySetInnerHTML={{ __html: body(article, language) }}
            />
          </motion.article>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-[#e4dcd3] pt-12">
            <h2 className="mb-6 text-2xl font-bold text-[#39342e]" style={FONT}>{t.related}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-[#e4dcd3] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,105,96,0.1)]"
                >
                  {r.category && (
                    <span className="text-xs font-semibold text-[#006960]" style={FONT}>{catName(r.category, language)}</span>
                  )}
                  <span className="font-semibold leading-snug text-[#39342e] transition-colors group-hover:text-[#006960]" style={FONT}>
                    {title(r, language)}
                  </span>
                  <span className="text-sm text-[#5c554d] line-clamp-2" style={FONT}>{excerpt(r, language)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
