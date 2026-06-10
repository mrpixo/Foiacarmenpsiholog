import { Linkedin, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "../i18n";

export function TopBar() {
  const { language } = useLanguage();
  return (
    <div className="w-full bg-[#054943] px-6 md:px-24 py-6 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
      {/* WhatsApp */}
      <p
        className="text-white text-base whitespace-nowrap"
        style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
      >
        WhatsApp:{" "}
        <a href="tel:0770111222" className="font-bold hover:text-[#ffba68] transition-colors">
          0770 111 222
        </a>
      </p>

      {/* English text */}
      <div className="flex items-center gap-3">
        <span className="text-white text-sm" style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}>
          I'm a British citizen and provide therapy in english
        </span>
        <span className="text-lg">🇬🇧</span>
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-3">
        {[
          { icon: <Linkedin size={20} />, href: "#" },
          { icon: <Facebook size={20} />, href: "#" },
          { icon: <Instagram size={20} />, href: "#" },
        ].map((social, i) => (
          <a
            key={i}
            href={social.href}
            className="size-12 rounded-full bg-white/8 flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200"
          >
            {social.icon}
          </a>
        ))}
        {/* X icon */}
        <a
          href="#"
          className="size-12 rounded-full bg-white/8 flex items-center justify-center text-white hover:bg-white/15 transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
