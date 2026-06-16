import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../i18n";
import { newsTitle, newsExcerpt, type NewsItem } from "../../lib/news-format";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/**
 * News card — same uniform layout as the blog ArticleCard (image → title →
 * excerpt → "read more", no alternation), themed for the green news surface.
 */
export function NewsCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group flex min-w-0 flex-1 flex-col gap-8"
    >
      <Link to={`/noutati/${item.slug}`} className="flex flex-col gap-6">
        {/* Image */}
        <div className="aspect-[400/300] w-full overflow-hidden rounded-2xl bg-white/10">
          {item.cover_url ? (
            <img
              src={item.cover_url}
              alt={newsTitle(item, language)}
              className="h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/15 to-white/5 transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>

        {/* Title */}
        <p
          className="text-white"
          style={{ ...FONT, fontWeight: 400, fontSize: "clamp(18px,2vw,32px)", lineHeight: 1.3 }}
        >
          {newsTitle(item, language)}
        </p>

        {/* Excerpt — 2 lines */}
        {newsExcerpt(item, language) && (
          <p className="line-clamp-2 text-base leading-7 text-white/80" style={FONT}>
            {newsExcerpt(item, language)}
          </p>
        )}

        {/* Read more */}
        <div className="flex items-center gap-3">
          <span className="text-base text-[#ffba68] underline" style={{ ...FONT, fontWeight: 600 }}>
            {language === "ro" ? "Vezi mai mult" : "Read more"}
          </span>
          <span className="relative size-5 overflow-hidden text-[#ffba68]">
            <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[18px] group-hover:-translate-y-[18px] group-hover:opacity-0">
              <ArrowUpRight size={20} />
            </span>
            <span className="absolute inset-0 flex translate-x-[-18px] translate-y-[18px] items-center justify-center opacity-0 transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={20} />
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
