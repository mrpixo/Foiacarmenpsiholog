import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";
import { isSupabaseConfigured } from "../lib/supabase";
import { listPublishedNews, type NewsItem } from "../lib/news";
import { NewsCard } from "./news/NewsCard";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** News section — GREEN background, "Ultimele noutăți". Shows the latest 6 updates. */
export function News() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listPublishedNews(6).then(setItems).catch(() => {});
  }, []);

  return (
    <section className="w-full py-24 md:py-[156px]" style={{ background: "#006960" }} id="noutati">
      <div className="px-6 md:px-[126px] flex flex-col gap-12">
        {/* Header row */}
        <div ref={ref} className="flex flex-col md:flex-row items-start justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <p className="text-white whitespace-nowrap" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.5 }}>
              {language === "ro" ? "Ultimele noutăți" : "Latest news"}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col items-end gap-3">
            <p className="text-white text-right text-base max-w-[420px]" style={{ ...FONT, fontWeight: 400, lineHeight: 1.5 }}>
              {language === "ro"
                ? "Evenimente, resurse și actualizări din activitatea mea în psihologie, echilibru și performanță."
                : "Insights, resources, and updates from my work in psychology, wellbeing, and performance."}
            </p>
            <Link
              to="/noutati"
              className="inline-flex w-full items-center justify-start bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:justify-center md:hover:scale-105"
              style={FONT}
            >
              {language === "ro" ? "Vezi toate noutățile" : "See all news"}
            </Link>
          </motion.div>
        </div>

        {/* News cards */}
        {items.length > 0 && (
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
