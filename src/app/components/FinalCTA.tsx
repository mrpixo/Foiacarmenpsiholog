import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Closing call-to-action section, before the footer. */
export function FinalCTA() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const ro = language === "ro";

  return (
    <section className="w-full bg-white py-16 md:py-[120px]">
      <div ref={ref} className="mx-auto max-w-[860px] px-6 md:px-12 flex flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#39342e]"
          style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.1 }}
        >
          {ro ? "Pregătit să faci primul pas?" : "Ready to take the first step?"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-[620px] text-base leading-7 text-[#5c554d]"
          style={FONT}
        >
          {ro
            ? "Programează o consultație și descoperă cum te pot sprijini în atingerea obiectivelor tale."
            : "Book a consultation and discover how I can support you in reaching your goals."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-auto"
        >
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#ffba68] px-8 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:hover:scale-105"
            style={FONT}
          >
            {ro ? "Programează o ședință" : "Book a session"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
