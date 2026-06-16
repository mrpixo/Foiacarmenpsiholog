import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { useLanguage } from "../../i18n";
import { title, excerpt, catName, type Article } from "../../lib/articles-format";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Blog article card — shared by the homepage section and the /blog page. */
export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
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
      <Link to={`/blog/${article.slug}`} className="flex flex-col gap-6">
        {/* Image */}
        <div className="aspect-[400/300] w-full overflow-hidden rounded-2xl bg-[#f5eee9]">
          {article.cover_url ? (
            <motion.img
              src={article.cover_url}
              alt={title(article, language)}
              className="h-full w-full rounded-2xl object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-[#dfeeec] to-[#f5eee9] transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>

        {/* Meta: category + reading time */}
        <div className="flex items-center gap-3 text-sm">
          {article.category && (
            <span className="rounded-full bg-[#006960]/8 px-3 py-1 font-semibold text-[#006960]" style={FONT}>
              {catName(article.category, language)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[#a89f95]" style={FONT}>
            <Clock size={14} /> {article.read_minutes} {language === "ro" ? "min citire" : "min read"}
          </span>
        </div>

        {/* Title */}
        <p
          className="text-[#39342e]"
          style={{ ...FONT, fontWeight: 400, fontSize: "clamp(18px,2vw,32px)", lineHeight: 1.3 }}
        >
          {title(article, language)}
        </p>

        {/* Excerpt — 2 lines */}
        {excerpt(article, language) && (
          <p className="line-clamp-2 text-base leading-7 text-[#5c554d]" style={FONT}>
            {excerpt(article, language)}
          </p>
        )}

        {/* Read more */}
        <div className="flex items-center gap-3">
          <span className="text-base text-[#006960] underline" style={{ ...FONT, fontWeight: 600 }}>
            {language === "ro" ? "Vezi mai mult" : "Read more"}
          </span>
          <span className="relative size-5 overflow-hidden text-[#006960]">
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
