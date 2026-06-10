import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import svgPaths from "../../imports/Header/svg-txdvk9yxpl";
import { useLanguage } from "../i18n";

const navLinks = {
  ro: [
    { label: "Despre mine", href: "#despre" },
    { label: "Servicii", href: "#servicii" },
    { label: "Terapie în engleză", href: "#engleza" },
    { label: "Pentru companii", href: "#companii" },
  ],
  en: [
    { label: "About me", href: "#despre" },
    { label: "Services", href: "#servicii" },
    { label: "Therapy in English", href: "#engleza" },
    { label: "For companies", href: "#companii" },
  ],
};

function HeaderLogoMark() {
  return (
    <div className="relative size-[60px] shrink-0">
      <div className="absolute inset-[-3.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" fill="#D9D9D9" r="31" stroke="#0D121A" strokeWidth="2" />
          <mask id="header-logo-mask" height="60" maskUnits="userSpaceOnUse" width="60" x="2" y="2">
            <circle cx="32" cy="32" fill="#D9D9D9" r="30" />
          </mask>
          <g mask="url(#header-logo-mask)">
            <path d={svgPaths.p2c848c00} fill="#0D121A" />
            <path d={svgPaths.p2deb6500} fill="#FFBA68" />
            <path d={svgPaths.p3476b270} fill="#FADFCF" />
            <path d={svgPaths.p22c43500} fill="#FADFCF" />
            <path d={svgPaths.p3940acc0} fill="#D32C26" />
            <path d={svgPaths.p7708400} fill="#0D121A" />
            <path d={svgPaths.p132f7570} fill="#FADFCF" />
            <path d={svgPaths.pdfb5280} fill="#FADFCF" />
            <path d={svgPaths.p17e6de00} fill="#0D121A" />
            <path d={svgPaths.p29ee0b00} fill="#FADFCF" />
            <path d={svgPaths.p124aff00} fill="#0D121A" />
            <path d={svgPaths.p5691e00} fill="#FFBA68" />
            <path d={svgPaths.p11cc3580} fill="#FFBA68" />
            <path d={svgPaths.pe3e0f00} fill="#FADFCF" />
            <path d={svgPaths.p32e31000} fill="#FADFCF" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed left-1/2 top-4 z-50 flex h-[76px] w-[calc(100%-2rem)] md:w-[calc(100%-252px)] -translate-x-1/2 items-center justify-between rounded-full px-4 backdrop-blur-[5px] transition-[background-color,box-shadow] duration-500",
        scrolled ? "bg-white/82 shadow-[0_8px_32px_rgba(0,105,96,0.12)]" : "bg-white/58 shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
      ].join(" ")}
    >
      {/* Logo — matched to imported Figma header */}
      <a href="#" className="flex shrink-0 items-center gap-4" aria-label={language === "ro" ? "Carmen Foia Psiholog homepage" : "Carmen Foia Psychologist homepage"}>
        <HeaderLogoMark />
        <div className="hidden h-[45px] flex-col items-start leading-[1.5] whitespace-nowrap sm:flex">
          <span className="text-[18px] font-semibold leading-[27px] text-[#1d293d]" style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}>
            {language === "ro" ? "Carmen Foia Psiholog" : "Carmen Foia Psychologist"}
          </span>
          <span className="text-[12px] font-medium uppercase leading-[18px] tracking-[2.1172px] text-[#62748e]" style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}>
            {language === "ro" ? "Psiholog Clinician" : "Clinical Psychologist"}
          </span>
        </div>
      </a>

      {/* Desktop nav — exact labels/order and imported spacing */}
      <nav className="hidden h-5 w-[454px] items-center justify-between lg:flex" aria-label={language === "ro" ? "Navigare principală" : "Primary navigation"}>
        {navLinks[language].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="group relative whitespace-nowrap text-[14px] font-medium leading-5 tracking-[-0.1504px] text-[#333] transition-colors duration-200 hover:text-[#006960]"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#006960] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        {/* CTA — imported 24px x 12px sizing */}
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-[#ffba68] px-6 py-3 text-[16px] font-semibold leading-6 tracking-[-0.3125px] text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
        >
          {language === "ro" ? "Programează-te acum" : "Book a session"}
        </a>

        {/* Language selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLanguageOpen((open) => !open)}
            className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-[46px] leading-none shadow-[0_4px_18px_rgba(0,0,0,0.06)] ring-1 ring-[#0d121a]/10 transition-all duration-300 hover:scale-105"
            aria-label="Select language"
            aria-expanded={languageOpen}
          >
            {language === "ro" ? "🇷🇴" : "🇬🇧"}
          </button>
          <AnimatePresence>
            {languageOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-[56px] z-50 flex flex-col gap-1 rounded-2xl bg-white/95 p-2 shadow-xl ring-1 ring-[#0d121a]/10 backdrop-blur-xl"
              >
                {[
                  { code: "ro" as const, flag: "🇷🇴", label: "Română" },
                  { code: "en" as const, flag: "🇬🇧", label: "English" },
                ].map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => { setLanguage(option.code); setLanguageOpen(false); }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#333] transition-colors hover:bg-[#f5eee9]"
                    style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
                  >
                    <span className="text-lg">{option.flag}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile toggle */}
      <button
        className="rounded-full p-2 text-[#39342e] transition-colors hover:bg-[#006960]/8 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile/tablet menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-[84px] flex flex-col gap-4 rounded-[28px] bg-white/95 p-6 shadow-xl backdrop-blur-xl lg:hidden"
          >
            {navLinks[language].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[#f5eee9] py-2 text-base font-medium text-[#333] transition-colors hover:text-[#006960]"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#ffba68] px-6 py-3 text-center text-[16px] font-semibold leading-6 tracking-[-0.3125px] text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
              >
                {language === "ro" ? "Programează-te acum" : "Book a session"}
              </a>
              <button
                type="button"
                onClick={() => setLanguage((current) => (current === "ro" ? "en" : "ro"))}
                className="flex size-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-[46px] leading-none ring-1 ring-[#0d121a]/10"
                aria-label={language === "ro" ? "Schimbă limba" : "Change language"}
              >
                {language === "ro" ? "🇷🇴" : "🇬🇧"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
