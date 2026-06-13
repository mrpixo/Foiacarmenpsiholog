import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";
import { isSupabaseConfigured } from "../lib/supabase";
import { listPublishedArticles, type Article } from "../lib/articles";
import { ArticleCard } from "./blog/ArticleCard";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Blog articles section — WHITE background. Shows the 3 latest published posts. */
export function Articles() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listPublishedArticles()
      .then((a) => setArticles(a.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-white py-24 md:py-[156px]" id="articole">
      <div className="px-6 md:px-[126px] flex flex-col gap-[98px]">
        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row items-start justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#39342e] whitespace-nowrap"
            style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.1 }}
          >
            {language === "ro" ? "Articole din blog" : "Blog articles"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-start md:items-end gap-3"
          >
            <p
              className="text-[#39342e] text-left md:text-right text-base max-w-[420px]"
              style={{ ...FONT, fontWeight: 400, lineHeight: 1.5 }}
            >
              {language === "ro"
                ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect."
                : "Thoughtful articles on therapy, wellbeing, performance, and personal growth."}
            </p>
            <Link
              to="/blog"
              className="inline-flex w-full items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:justify-center md:hover:scale-105"
              style={FONT}
            >
              {language === "ro" ? "Vezi toate articolele" : "See all articles"}
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
