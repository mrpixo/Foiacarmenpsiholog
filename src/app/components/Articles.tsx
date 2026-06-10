import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import imgRect2 from "../../imports/Body/2c9abaa741df4f12ecad8571b4ecafe26351a587.png";
import imgRect3 from "../../imports/Body/c82ebfae41c60afda563655b053f3a79e3493e39.png";
import imgRect4 from "../../imports/Body/dc7d1ed2839bf6067ea97d1e9ff0fea5e2bbb81a.png";
import { useLanguage } from "../i18n";

/** Blog articles section — WHITE background */
const articlesRo = [
  { id: 1, title: "Cum abordăm anxietatea de performanță?", image: imgRect2 },
  { id: 2, title: "Ce înseamnă un spațiu terapeutic sigur?", image: imgRect3 },
  { id: 3, title: "Reglarea emoțională pentru echilibru zilnic", image: imgRect4 },
];

const articlesEn = [
  { id: 1, title: "How do we manage performance anxiety?", image: imgRect2 },
  { id: 2, title: "What does a safe therapeutic space mean?", image: imgRect3 },
  { id: 3, title: "Emotional regulation for everyday balance", image: imgRect4 },
];

function ArticleCard({ article, index }: { article: typeof articlesRo[0]; index: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 flex-1 min-w-0 cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-[400/300] overflow-hidden w-full rounded-2xl">
        <motion.img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover rounded-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Title */}
      <p
        className="text-[#39342e]"
        style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(18px,2vw,32px)", lineHeight: 1.5 }}
      >
        {article.title}
      </p>

      {/* Read more */}
      <div className="flex items-center gap-3">
        <span
          className="text-[#006960] underline text-base"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 600 }}
        >
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
    </motion.article>
  );
}

export function Articles() {
  const { language } = useLanguage();
  const articles = language === "ro" ? articlesRo : articlesEn;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full bg-white py-24 md:py-[156px]" id="articole">
      <div className="px-8 md:px-[126px] flex flex-col gap-[98px]">
        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row items-start justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#39342e] whitespace-nowrap"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.1 }}
          >
            {language === "ro" ? "Articole din blog" : "Blog articles"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-end gap-3"
          >
            <p
              className="text-[#39342e] text-right text-base max-w-[420px]"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, lineHeight: 1.5 }}
            >
              {language === "ro" ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect." : "Thoughtful articles on therapy, wellbeing, performance, and personal growth."}
            </p>
            <a
              href="#articole"
              className="inline-flex items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
            >
              {language === "ro" ? "Vezi toate articolele" : "See all articles"}
            </a>
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
