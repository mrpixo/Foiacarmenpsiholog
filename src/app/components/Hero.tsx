import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import imgPortrait from "../../imports/Body/0246f3802382d4dbbdc1a474bf81eaf76c14991a.webp";
import imgHeroBg from "../../imports/Body/019dd9eeb6b49b7cdb6f1dd68088dd908e2ec026.webp";
import { useLanguage } from "../i18n";

const heroServices = {
  ro: ["Orientare în carieră", "Psihologie sportivă", "Terapie individuală", "Motivare", "Dezvoltare personală", "Studenți"],
  en: ["Career guidance", "Sports psychology", "Individual therapy", "Motivation", "Personal development", "Students"],
};

const heroQuote = {
  ro: "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect.",
  en: "Every person is unique, and the therapeutic approach is tailored to your specific needs and goals, in a space grounded in empathy and respect.",
};

/** Top beige section — service list (left) + quote (right) + watermark */
export function HeroTop() {
  const { language } = useLanguage();
  const services = heroServices[language];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: watermark drifts up slower than scroll
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  // Parallax: right-side quote drifts slightly upward
  const quoteY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  // Parallax: service list drifts slightly
  const listY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: "#f5eee9", minHeight: "760px", position: "relative" }}
    >
      {/* Watermark — absolute, bottom-left, parallax */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute bottom-0 left-[-17px] pointer-events-none select-none leading-none will-change-transform z-0"
      >
        <div
          style={{
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(80px,16vw,283px)",
            lineHeight: 1,
            color: "#f9f5f2",
            whiteSpace: "nowrap",
          }}
        >
          {language === "ro" ? "Psiholog" : "Psychologist"}
        </div>
        <div
          style={{
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(80px,16vw,283px)",
            lineHeight: 1,
            color: "#f9f5f2",
            whiteSpace: "nowrap",
          }}
        >
          Carmen Foia
        </div>
      </motion.div>

      {/* Content row */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-8 md:px-[126px] py-24 md:py-[96px] min-h-[760px]">

        {/* LEFT: Service categories */}
        <motion.div
          style={{ y: listY }}
          className="flex w-full flex-col will-change-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {services.map((service, i) => (
            <motion.p
              key={service}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#1f1d1a] cursor-default"
              style={{
                fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px,3.8vw,56px)",
                lineHeight: 1.2,
              }}
            >
              {service}
            </motion.p>
          ))}

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
            >
              {language === "ro" ? "Programează-te acum" : "Book a session"}
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT: Quote text */}
        <motion.p
          className="w-full max-w-none will-change-transform"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            y: quoteY,
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(18px,2.4vw,40px)",
            lineHeight: 1.5,
            color: "#675949",
            textAlign: "right",
            maxWidth: "none",
          }}
        >
          {heroQuote[language]}
        </motion.p>
      </div>
    </section>
  );
}

/** Full-width photo section with portrait — parallax on both */
export function HeroPhoto() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Background photo scrolls slower (parallax)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  // Portrait drifts slightly upward
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: "#f8fafc", minHeight: "clamp(400px,55vw,952px)", position: "relative" }}
    >
      {/* Background photo with parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-10%] will-change-transform"
      >
        <img
          src={imgHeroBg}
          alt={language === "ro" ? "Cabinet psiholog" : "Psychology office"}
          className="w-full h-full object-cover rounded-2xl"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(51,48,45,0.2)]" />

      {/* Portrait — right of center, parallax */}
      <motion.div
        className="absolute will-change-transform"
        style={{
          y: portraitY,
          right: "15%",
          top: 0,
          width: "clamp(200px,31vw,543px)",
          height: "100%",
        }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={imgPortrait}
          alt={language === "ro" ? "Carmen Foia Psiholog" : "Carmen Foia Psychologist"}
          className="w-full h-full object-contain object-bottom rounded-2xl"
        />
      </motion.div>
    </section>
  );
}
