import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { getPublishedNewsBySlug, newsTitle, newsExcerpt, newsBody, type NewsItem } from "../../lib/news";
import { NewsContent } from "./NewsContent";
import { NotConfigured } from "../blog/NotConfigured";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: { back: "Toate noutățile", notFound: "Noutatea nu a fost găsită.", loading: "Se încarcă..." },
  en: { back: "All news", notFound: "Update not found.", loading: "Loading..." },
};

function formatDate(iso: string | null, lang: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function NewsDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = copy[language];
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) { setLoading(false); return; }
    setLoading(true);
    getPublishedNewsBySlug(slug).then(setItem).finally(() => setLoading(false));
  }, [slug]);

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[820px]">
        <Link to="/noutati" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]" style={FONT}>
          <ArrowLeft size={16} /> {t.back}
        </Link>

        {!isSupabaseConfigured ? (
          <NotConfigured />
        ) : loading ? (
          <p className="text-[#5c554d]" style={FONT}>{t.loading}</p>
        ) : !item ? (
          <p className="text-[#5c554d]" style={FONT}>{t.notFound}</p>
        ) : (
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-3 text-sm text-[#a89f95]" style={FONT}>{formatDate(item.published_at, language)}</p>
            <h1 className="text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.15 }}>
              {newsTitle(item, language)}
            </h1>
            {newsExcerpt(item, language) && (
              <p className="mt-4 text-lg leading-8 text-[#5c554d]" style={FONT}>{newsExcerpt(item, language)}</p>
            )}
            {item.cover_url && <img src={item.cover_url} alt="" className="mt-8 w-full rounded-3xl object-cover" />}
            <div className="mt-8">
              <NewsContent html={newsBody(item, language)} />
            </div>
          </motion.article>
        )}
      </div>
    </section>
  );
}
