import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";
import imgCsm from "../../imports/CSM_Oradea_logo-en.png";
import imgUni from "../../imports/Universitate Oradea-logo.png";
import imgSpital from "../../imports/Spitalul Judetean Oradea-logo.jpeg";
import imgDaso from "../../imports/DASO-logo.png";
import imgAsoc from "../../imports/Asociatia Psihologi-logo.png";

/** Partner / experience logos (files in src/imports/). */
const logos = [
  { src: imgCsm, alt: "CSM Oradea" },
  { src: imgUni, alt: "Universitatea din Oradea" },
  { src: imgSpital, alt: "Spitalul Clinic Județean de Urgență „Gavril Curteanu” Oradea" },
  { src: imgDaso, alt: "DASO" },
  { src: imgAsoc, alt: "Asociația Psihologi pentru Comunitate" },
];

export function Logos() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  // Repeat the set enough times that one half of the track is wider than any
  // viewport, then duplicate it — so the -50% loop never reveals empty space.
  const oneSet = [...logos, ...logos, ...logos];
  const track = [...oneSet, ...oneSet];

  return (
    <section className="w-full overflow-hidden py-20" style={{ background: "#f5eee9" }}>
      <div ref={ref} className="px-8 md:px-[128px] mb-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-left text-[#39342e]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,64px)", lineHeight: 1.5 }}
        >
          {language === "ro" ? "Experiența cu" : "Experience with"}
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative mt-4">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f5eee9, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f5eee9, transparent)" }} />

        <motion.div
          className="flex items-center gap-0 will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {track.map((logo, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center px-10 py-5">
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.alt}
                loading="lazy"
                className="h-16 w-auto max-w-[180px] object-contain opacity-80 transition-opacity duration-200 hover:opacity-100 md:h-20"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
