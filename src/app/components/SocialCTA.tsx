import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "../i18n";
import { useIsMobile, entrance } from "../lib/useIsMobile";

export function SocialCTA() {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      className="selection-teal relative w-full overflow-hidden py-16 md:py-[64px]"
      style={{ background: "#054943" }}
    >
      {/* Big watermark */}
      <div
        className="absolute top-0 left-[-23px] pointer-events-none select-none leading-none"
        style={{
          fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "293px",
          lineHeight: 1,
          color: "rgba(255,255,255,0.05)",
          whiteSpace: "nowrap",
        }}
      >
        Socials
      </div>

      <div ref={ref} className="relative z-10 px-6 md:px-[126px] flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white max-w-[520px]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,64px)", lineHeight: 1.2 }}
        >
          {language === "ro" ? "Sunt și sociabilă" : "I'm sociable too"}
        </motion.p>

        {/* CTA first, then social icon buttons (centered) */}
        <motion.div
          initial={{ opacity: 0, ...entrance(isMobile, 20) }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex w-full flex-col items-center gap-5 md:w-auto md:flex-row md:items-center md:gap-4"
        >
          <Link
            to="/contact"
            className="flex w-full items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:justify-center md:hover:scale-105"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
          >
            {language === "ro" ? "Programează-te acum" : "Book a session"}
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { icon: <Linkedin size={22} /> },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.53V6.77a4.86 4.86 0 0 1-1.01-.08z"/></svg> },
            { icon: <Instagram size={22} /> },
            { icon: <Facebook size={22} /> },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
          ].map((social, i) => (
            <a
              key={i}
              href="#"
              className="size-12 rounded-full bg-white/8 flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200"
            >
              {social.icon}
            </a>
          ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
