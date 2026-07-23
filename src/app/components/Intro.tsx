import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { useLanguage } from "../i18n";

const introText = {
  ro: "Fiecare persoană are provocări diferite. Împreună identificăm soluții practice care te ajută să obții mai multă claritate, încredere și echilibru.",
  en: "Every person faces different challenges. Together we find practical solutions that help you gain more clarity, confidence, and balance.",
};

function Word({ word, index, total, scrollYProgress }: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const color = useTransform(scrollYProgress, [start, end], ["#4a9e98", "#ffffff"]);

  return (
    <motion.span style={{ color }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

export function Intro() {
  const { language } = useLanguage();
  const words = introText[language].split(" ");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.3"],
  });

  return (
    <section
      ref={ref}
      className="selection-teal relative w-full py-32 md:py-40"
      style={{ background: "#006960", position: "relative" }}
    >
      <div className="max-w-none px-6 md:px-24 flex flex-col items-start gap-12">
        <p
          className="w-full max-w-none text-left"
          style={{
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(24px,4vw,60px)",
            lineHeight: 1.3,
          }}
        >
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              index={i * 0.35}
              total={words.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </p>

        <motion.div
          className="flex w-full justify-end"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:justify-center md:hover:scale-105"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
          >
            {language === "ro" ? "Programează-te acum" : "Book a session"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
