import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../i18n";
import { newsTitle, type NewsItem } from "../../lib/news-format";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** News card — white text on green, matching the homepage "Ultimele noutăți" design. */
export function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [hovered, setHovered] = useState(false);
  const imageFirst = index % 3 !== 1;

  const image = (
    <div className="aspect-[400/300] w-full overflow-hidden rounded-2xl bg-white/10">
      {item.cover_url ? (
        <motion.img
          src={item.cover_url}
          alt={newsTitle(item, language)}
          className="h-full w-full rounded-2xl object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/15 to-white/5" />
      )}
    </div>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.5), ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group flex h-full flex-1 basis-0 flex-col gap-4 min-w-0"
    >
      <Link to={`/noutati/${item.slug}`} className="flex h-full flex-col gap-4">
        {/* On mobile always image → title → link; on desktop alternate. */}
        <div className={!imageFirst ? "md:order-2" : ""}>{image}</div>
        <div className={["flex flex-col gap-4", !imageFirst ? "md:order-1" : ""].join(" ")}>
          <p className="text-white" style={{ ...FONT, fontWeight: 400, fontSize: "clamp(18px,2vw,32px)", lineHeight: 1.5 }}>
            {newsTitle(item, language)}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[#ffba68] underline text-base" style={{ ...FONT, fontWeight: 600 }}>
              {language === "ro" ? "Vezi mai mult" : "Read more"}
            </span>
            <span className="relative size-5 overflow-hidden text-[#ffba68]">
              <motion.span className="absolute inset-0 flex items-center justify-center" animate={hovered ? { x: 18, y: -18, opacity: 0 } : { x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}>
                <ArrowUpRight size={20} />
              </motion.span>
              <motion.span className="absolute inset-0 flex items-center justify-center" initial={false} animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -18, y: 18, opacity: 0 }} transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1], delay: hovered ? 0.08 : 0 }}>
                <ArrowUpRight size={20} />
              </motion.span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
