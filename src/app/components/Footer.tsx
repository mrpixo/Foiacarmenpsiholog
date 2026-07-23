import { Linkedin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router";
import svgPaths from "../../imports/Header/svg-txdvk9yxpl";
import { useLanguage } from "../i18n";
import { useConsent } from "../lib/consent";

type FooterLink = { label: string; to?: string; href?: string; action?: "cookies" };
type FooterColumn = { label: string; links: FooterLink[] };

export function Footer() {
  const { language } = useLanguage();
  const { openSettings } = useConsent();
  const ro = language === "ro";

  const columns: FooterColumn[] = [
    {
      label: ro ? "Servicii" : "Services",
      links: [
        { label: ro ? "Consiliere" : "Counselling", href: "/#servicii" },
        { label: ro ? "Companii" : "Companies", href: "/#servicii" },
      ],
    },
    {
      label: ro ? "Despre" : "About",
      links: [{ label: ro ? "Despre mine" : "About me", href: "/#despre" }],
    },
    {
      label: "Resources",
      links: [
        { label: "Blog", to: "/blog" },
        { label: ro ? "Întrebări frecvente" : "FAQ", to: "/intrebari-frecvente" },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: ro ? "Politica de confidențialitate" : "Privacy Policy", to: "/privacy" },
        { label: ro ? "Termeni și condiții" : "Terms & Conditions", to: "/terms" },
        { label: ro ? "Setări cookie-uri" : "Cookie settings", action: "cookies" },
      ],
    },
  ];

  const linkClass = "block py-3 text-white/90 transition-colors duration-200 hover:text-white";
  const linkStyle = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: 1.5 } as const;
  const renderLink = (l: FooterLink) => {
    if (l.to) return <Link key={l.label} to={l.to} className={linkClass} style={linkStyle}>{l.label}</Link>;
    if (l.action === "cookies")
      return <button key={l.label} type="button" onClick={openSettings} className={`${linkClass} cursor-pointer text-left`} style={linkStyle}>{l.label}</button>;
    return <a key={l.label} href={l.href} className={linkClass} style={linkStyle}>{l.label}</a>;
  };
  return (
    <footer className="selection-teal relative w-full overflow-hidden" style={{ background: "#054943" }}>
      <div className="relative z-10 px-6 md:px-[164px] pt-24 md:pt-[96px] pb-[clamp(160px,24vw,390px)] flex flex-col gap-8">
        {/* Top: logo + social + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative size-[60px] shrink-0">
              <div className="absolute inset-[-3.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" fill="#D9D9D9" r="31" stroke="#0D121A" strokeWidth="2" />
                  <mask id="footer-logo-mask" height="60" maskUnits="userSpaceOnUse" width="60" x="2" y="2">
                    <circle cx="32" cy="32" fill="#D9D9D9" r="30" />
                  </mask>
                  <g mask="url(#footer-logo-mask)">
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
            <div className="flex flex-col">
              <span
                className="text-white"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 600, fontSize: "18px", lineHeight: 1.5 }}
              >
                Carmen Foia Psiholog
              </span>
              <span
                className="text-white/70 uppercase tracking-[2.1px]"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 500, fontSize: "12px" }}
              >
                {language === "ro" ? "Psiholog Clinician" : "Clinical Psychologist"}
              </span>
            </div>
          </div>

          {/* Social + CTA — mobile: full-width CTA then centered socials; desktop: socials then CTA */}
          <div className="flex w-full flex-col items-center gap-5 md:w-auto md:flex-row md:items-center md:gap-4">
            <div className="order-2 flex flex-wrap items-center justify-center gap-3 md:order-1">
              {[
                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/carmen-foia-960604b4" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.53V6.77a4.86 4.86 0 0 1-1.01-.08z"/></svg> },
                { icon: <Instagram size={20} /> },
                { icon: <Facebook size={20} /> },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              ].map((social: { icon: JSX.Element; href?: string }, i) => (
                <a
                  key={i}
                  href={social.href ?? "#"}
                  {...(social.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="size-12 rounded-full bg-white/8 flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <Link
              to="/contact"
              className="order-1 flex w-full items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:order-2 md:w-auto md:justify-center md:hover:scale-105"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
            >
              {language === "ro" ? "Programează-te acum" : "Book a session"}
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/8 rounded-full" />

        {/* Nav columns — equal width, spread across full width (per Figma) */}
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
          {columns.map((col) => (
            <div key={col.label} className="flex flex-1 flex-col gap-5">
              <p
                className="text-white/70"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}
              >
                {col.label}
              </p>
              <div className="flex flex-col">{col.links.map(renderLink)}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/8 rounded-full" />

        {/* Copyright */}
        <p
          className="w-full text-white/70"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}
        >
          {language === "ro" ? "© 2026 Carmen Foia Psiholog clinician și educațional" : "© 2026 Carmen Foia Clinical and Educational Psychologist"}
        </p>
      </div>

      {/* Large watermark text — fills the bottom padding (per Figma).
          Both lines are 283px and overlap (~0.6em line advance), in #12524c. */}
      <div
        className="absolute left-[-17px] z-0 pointer-events-none select-none leading-none"
        style={{ bottom: "-0.25em", fontSize: "clamp(80px,16vw,283px)" }}
      >
        <div
          style={{
            fontFamily: "'Oakes Grotesk', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(80px,16vw,283px)",
            lineHeight: 1,
            color: "#12524c",
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
            color: "#12524c",
            whiteSpace: "nowrap",
            marginTop: "-0.4em",
          }}
        >
          Carmen Foia
        </div>
      </div>
    </footer>
  );
}
