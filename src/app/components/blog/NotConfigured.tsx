import { useLanguage } from "../../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Shown on blog/admin when Supabase env vars are not set yet. */
export function NotConfigured() {
  const { language } = useLanguage();
  const ro = language === "ro";
  return (
    <div className="rounded-3xl border border-dashed border-[#e4dcd3] bg-white p-8 text-[#5c554d]" style={FONT}>
      <h2 className="mb-2 text-lg font-semibold text-[#39342e]">
        {ro ? "Blogul nu este încă configurat" : "The blog isn't configured yet"}
      </h2>
      <p className="text-sm leading-6">
        {ro
          ? "Adaugă datele proiectului Supabase în fișierul .env (VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY) și repornește serverul. Vezi BLOG_SETUP.md."
          : "Add your Supabase project credentials to the .env file (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) and restart the dev server. See BLOG_SETUP.md."}
      </p>
    </div>
  );
}
