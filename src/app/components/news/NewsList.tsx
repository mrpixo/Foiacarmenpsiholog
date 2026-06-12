import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { listPublishedNews, type NewsItem } from "../../lib/news";
import { NewsCard } from "./NewsCard";
import { HomeLink } from "../HomeLink";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: { eyebrow: "Noutăți", title: "Toate noutățile", subtitle: "Evenimente, resurse și actualizări din activitatea mea.", empty: "Nicio noutate încă.", loading: "Se încarcă...", notConfigured: "Secțiunea nu este încă configurată. Vezi BLOG_SETUP.md." },
  en: { eyebrow: "News", title: "All news", subtitle: "Events, resources, and updates from my work.", empty: "No news yet.", loading: "Loading...", notConfigured: "This section isn't configured yet. See BLOG_SETUP.md." },
};

export function NewsList() {
  const { language } = useLanguage();
  const t = copy[language];
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    listPublishedNews().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44" style={{ background: "#006960" }}>
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
          <div className="grid grid-cols-1 items-stretch gap-12 auto-rows-fr md:grid-cols-3">
            {items.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
