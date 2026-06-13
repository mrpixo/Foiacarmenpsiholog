import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

export function Mission() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-[96px]"
      style={{ background: "#f5eee9", position: "relative" }}
    >
      {/* Watermark — sits flush at the bottom of the section (per Figma) */}
      <div className="absolute bottom-0 left-[-14px] pointer-events-none select-none leading-none">
        <div
          className="text-[clamp(80px,14vw,283px)] font-black whitespace-nowrap text-white/40"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", lineHeight: 1 }}
        >
          {language === "ro" ? "Misiunea mea" : "My mission"}
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-24 flex flex-col items-start md:items-end gap-10">
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#39342e] text-left md:text-right max-w-[810px]"
          style={{
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(20px,2.8vw,40px)",
            lineHeight: 1.5,
          }}
        >
          {language === "ro" ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect." : "Every person is unique, and therapy should meet their specific needs and goals within an environment built on empathy and respect."}
        </motion.p>
      </div>
    </section>
  );
}
