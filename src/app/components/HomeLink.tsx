import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Consistent "Home" link used at the top of content pages. */
export function HomeLink({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { language } = useLanguage();
  const cls =
    tone === "light"
      ? "text-white/80 hover:text-white"
      : "text-[#006960] hover:text-[#054943]";
  return (
    <Link to="/" className={`mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors ${cls}`} style={FONT}>
      <ArrowLeft size={16} /> {language === "ro" ? "Acasă" : "Home"}
    </Link>
  );
}
