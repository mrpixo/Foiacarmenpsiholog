import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { listPublishedNews, type NewsItem } from "../../lib/news";
import { NewsCard } from "./NewsCard";
import { HomeLink } from "../HomeLink";
import { useSeo } from "../../lib/seo";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: { eyebrow: "Noutăți", title: "Noutăți", subtitle: "Evenimente, conferințe, workshopuri, interviuri și proiectele în care sunt implicată.", empty: "Nicio noutate încă.", loading: "Se încarcă...", notConfigured: "Secțiunea nu este încă configurată. Vezi BLOG_SETUP.md.", loadMore: "Încarcă mai multe" },
  en: { eyebrow: "News", title: "News", subtitle: "Events, conferences, workshops, interviews, and the projects I'm involved in.", empty: "No news yet.", loading: "Loading...", notConfigured: "This section isn't configured yet. See BLOG_SETUP.md.", loadMore: "Load more" },
};

export function NewsList() {
  const { language } = useLanguage();
  const t = copy[language];
  useSeo({
    title: { ro: "Noutăți și evenimente — Carmen Foia", en: "News and events — Carmen Foia" },
    description: {
      ro: "Evenimente, resurse și actualizări din activitatea Carmen Foia, psiholog în Oradea.",
      en: "Events, resources and updates from Carmen Foia, psychologist in Oradea.",
    },
    path: "/noutati",
  });
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(6); // reveal 6 at a time via "Load more"

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    listPublishedNews().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="selection-teal w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44" style={{ background: "#006960" }}>
      <div className="mx-auto max-w-[1200px]">
        <HomeLink tone="light" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#ffba68]" style={FONT}>{t.eyebrow}</span>
          <h1 className="mt-3 text-white" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}>{t.title}</h1>
          <p className="mt-4 max-w-[640px] text-base leading-7 text-white/80" style={FONT}>{t.subtitle}</p>
        </motion.div>

        {!isSupabaseConfigured ? (
          <p className="text-white/80" style={FONT}>{t.notConfigured}</p>
        ) : loading ? (
          <p className="text-white/80" style={FONT}>{t.loading}</p>
        ) : items.length === 0 ? (
          <p className="text-white/80" style={FONT}>{t.empty}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, visible).map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </div>
            {visible < items.length && (
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + 6)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#ffba68] px-8 py-3.5 font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:hover:scale-105"
                  style={FONT}
                >
                  {t.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
