import { Linkedin, Instagram, Facebook } from "lucide-react";
import svgPaths from "../../imports/Header/svg-txdvk9yxpl";
import { useLanguage } from "../i18n";

const footerLinks = [
  {
    label: "Servicii",
    links: ["Consiliere", "Companii"],
  },
  {
    label: "Despre",
    links: ["Despre mine"],
  },
  {
    label: "Resources",
    links: ["Blog", "Întrebări frecvente"],
  },
  {
    label: "Legal",
    links: ["Politica de confidentialitate", "Termeni și condiții"],
  },
];

export function Footer() {
  const { language } = useLanguage();
  const footerLinksTranslated = language === "ro" ? footerLinks : [
    { label: "Services", links: ["Counselling", "Companies"] },
    { label: "About", links: ["About me"] },
    { label: "Resources", links: ["Blog", "Frequently asked questions"] },
    { label: "Legal", links: ["Privacy policy", "Terms and conditions"] },
  ];
  return (
    <footer className="relative w-full overflow-hidden" style={{ background: "#054943" }}>
      <div className="relative z-10 px-8 md:px-[164px] pt-24 pb-[200px] flex flex-col gap-8">
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

          {/* Social + CTA */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {[
                { icon: <Linkedin size={20} /> },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.53V6.77a4.86 4.86 0 0 1-1.01-.08z"/></svg> },
                { icon: <Instagram size={20} /> },
                { icon: <Facebook size={20} /> },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
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

            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[#ffba68] text-[#1f1d1b] font-semibold text-base px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
            >
              {language === "ro" ? "Programează-te acum" : "Book a session"}
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/8 rounded-full" />

        {/* Nav columns */}
        <div className="flex flex-wrap gap-12">
          {footerLinksTranslated.map((col) => (
            <div key={col.label} className="flex flex-col gap-5 min-w-[120px]">
              <p
                className="text-white/70"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}
              >
                {col.label}
              </p>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/90 hover:text-white transition-colors duration-200"
                  style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: 1.5 }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/8 rounded-full" />

        {/* Copyright */}
        <p
          className="text-white/70"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}
        >
          {language === "ro" ? "© 2025 Carmen Foia Psiholog clinician și educațional" : "© 2025 Carmen Foia Clinical and Educational Psychologist"}
        </p>
      </div>

      {/* Large watermark text */}
      <div className="absolute bottom-0 left-[-17px] pointer-events-none select-none leading-none">
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
            fontSize: "clamp(65px,13vw,230px)",
            lineHeight: 1,
            color: "#12524c",
            whiteSpace: "nowrap",
          }}
        >
          Carmen Foia
        </div>
      </div>
    </footer>
  );
}
