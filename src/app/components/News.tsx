import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import imgRect2 from "../../imports/Body/2c9abaa741df4f12ecad8571b4ecafe26351a587.png";
import imgRect3 from "../../imports/Body/c82ebfae41c60afda563655b053f3a79e3493e39.png";
import imgRect4 from "../../imports/Body/dc7d1ed2839bf6067ea97d1e9ff0fea5e2bbb81a.png";
import { useLanguage } from "../i18n";

/** News section — GREEN background, "Ultimele noutati" */
const newsRow1Ro = [
  { id: 1, title: "Ziua sportului CSM Oradea", image: imgRect2, imageFirst: true },
  { id: 2, title: "Talk", image: imgRect3, imageFirst: false },
  { id: 3, title: "O nouă sesiune pe adicții • Grup adicții", image: imgRect4, imageFirst: true },
];

const newsRow2Ro = [
  { id: 4, title: "Cum abordăm parentingul adolescenților anti sociali • Episod din podcast nou", image: imgRect2, imageFirst: true },
  { id: 5, title: "Am lansat cartea \"Părinți\" • Lansare de carte", image: imgRect3, imageFirst: false },
  { id: 6, title: "Resurse noi pentru echilibru emoțional", image: imgRect4, imageFirst: true },
];

const newsRow1En = [
  { id: 1, title: "CSM Oradea Sports Day", image: imgRect2, imageFirst: true },
  { id: 2, title: "Talk", image: imgRect3, imageFirst: false },
  { id: 3, title: "A new session on addictions • Addiction group", image: imgRect4, imageFirst: true },
];

const newsRow2En = [
  { id: 4, title: "How we approach parenting antisocial teenagers • New podcast episode", image: imgRect2, imageFirst: true },
  { id: 5, title: "I launched the book \"Parents\" • Book launch", image: imgRect3, imageFirst: false },
  { id: 6, title: "New resources for emotional balance", image: imgRect4, imageFirst: true },
];

function NewsCard({ item, index }: { item: typeof newsRow1Ro[0]; index: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex h-full flex-1 basis-0 flex-col gap-4 min-w-0 cursor-pointer group"
    >
      {item.imageFirst && (
        <div className="aspect-[400/300] w-full overflow-hidden rounded-2xl">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-2xl"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <p
          className="text-white"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(18px,2vw,32px)", lineHeight: 1.5 }}
        >
          {item.title}
        </p>
        <div className="flex items-center gap-3">
        <span
          className="text-[#ffba68] underline text-base"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 600 }}
        >
          {language === "ro" ? "Vezi mai mult" : "Read more"}
        </span>
        <span className="relative size-5 overflow-hidden text-[#ffba68]">
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            animate={hovered ? { x: 18, y: -18, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}
          >
            <ArrowUpRight size={20} />
          </motion.span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -18, y: 18, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1], delay: hovered ? 0.08 : 0 }}
          >
            <ArrowUpRight size={20} />
          </motion.span>
        </span>
        </div>
      </div>
      {!item.imageFirst && (
        <div className="aspect-[400/300] w-full overflow-hidden rounded-2xl">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-2xl"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
    </motion.article>
  );
}

export function News() {
  const { language } = useLanguage();
  const row1 = language === "ro" ? newsRow1Ro : newsRow1En;
  const row2 = language === "ro" ? newsRow2Ro : newsRow2En;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full py-24 md:py-[156px]" style={{ background: "#006960" }} id="noutati">
      <div className="px-8 md:px-[126px] flex flex-col gap-12">
        {/* Header row */}
        <div ref={ref} className="flex flex-col md:flex-row items-start justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-white whitespace-nowrap"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.5 }}
            >
              {language === "ro" ? "Ultimele noutăți" : "Latest news"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-end gap-3"
          >
            <p
              className="text-white text-right text-base max-w-[420px]"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, lineHeight: 1.5 }}
            >
              {language === "ro" ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect." : "Insights, resources, and updates from my work in psychology, wellbeing, and performance."}
            </p>
            <a
              href="#noutati"
              className="inline-flex items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
            >
              {language === "ro" ? "Vezi toate noutățile" : "See all news"}
            </a>
          </motion.div>
        </div>

        {/* News cards */}
        <div className="grid grid-cols-1 items-stretch gap-12 auto-rows-fr md:grid-cols-3">
          {[...row1, ...row2].map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
