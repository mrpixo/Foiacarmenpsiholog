import { Link, useLocation } from "react-router";
import { useLanguage } from "../../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Tab switcher between the blog and news admin sections. */
export function AdminTabs() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const ro = language === "ro";

  const tab = (active: boolean) =>
    [
      "cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors",
      active ? "bg-[#006960] text-white" : "text-[#5c554d] hover:text-[#006960]",
    ].join(" ");

  const isNews = pathname.startsWith("/admin/news");
  const isTest = pathname.startsWith("/admin/testimonials");
  const isFaq = pathname.startsWith("/admin/faq");
  const isBlog = !isNews && !isTest && !isFaq;

  return (
    <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-[#e4dcd3] bg-white p-1" style={FONT}>
      <Link to="/admin" className={tab(isBlog)}>{ro ? "Articole" : "Articles"}</Link>
      <Link to="/admin/news" className={tab(isNews)}>{ro ? "Noutăți" : "News"}</Link>
      <Link to="/admin/testimonials" className={tab(isTest)}>{ro ? "Testimoniale" : "Testimonials"}</Link>
      <Link to="/admin/faq" className={tab(isFaq)}>{ro ? "Întrebări" : "FAQ"}</Link>
    </div>
  );
}
