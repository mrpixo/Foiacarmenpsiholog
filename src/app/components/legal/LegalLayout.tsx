import { useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const { language } = useLanguage();
  useEffect(() => {
    document.title = `${title} | Carmen Foia — Psiholog Oradea`;
    document.documentElement.lang = language;
  }, [title, language]);
  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[820px]">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]"
          style={FONT}
        >
          <ArrowLeft size={16} /> {language === "ro" ? "Acasă" : "Home"}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>
            {eyebrow}
          </span>
          <h1
            className="mt-3 text-[#39342e]"
            style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,4.5vw,56px)", lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <p className="mt-3 text-sm text-[#a89f95]" style={FONT}>
            {language === "ro" ? "Ultima actualizare:" : "Last updated:"} {updated}
          </p>

          <div className="legal-prose blog-prose mt-10" style={FONT}>
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
