import { Linkedin, Instagram, Facebook } from "lucide-react";
import { FlagGB } from "./Flags";

export function TopBar() {
  return (
    <div className="w-full bg-[#054943] px-6 md:px-24 py-6 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
      {/* Phone / WhatsApp */}
      <p
        className="text-white text-base text-center md:text-left"
        style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
      >
        WhatsApp:{" "}
        <a
          href="https://wa.me/40770926562"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold whitespace-nowrap hover:text-[#ffba68] transition-colors"
        >
          0770 926 562
        </a>
      </p>

      {/* English text */}
      <div className="flex items-center gap-3">
        <FlagGB className="size-6 shrink-0" />
        <span className="text-white text-sm" style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}>
          Licensed Psychologist for over 15+ years, I am British citizen, offering counselling also in English
        </span>
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-3">
        {[
          { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/carmen-foia-960604b4" },
          { icon: <Facebook size={20} />, href: "#" },
          { icon: <Instagram size={20} />, href: "#" },
        ].map((social, i) => (
          <a
            key={i}
            href={social.href}
            {...(social.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
