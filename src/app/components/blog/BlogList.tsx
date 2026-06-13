import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { HomeLink } from "../HomeLink";
import { useSeo } from "../../lib/seo";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import {
  listPublishedArticles,
  listCategories,
  catName,
  title,
  excerpt,
  type Article,
  type Category,
} from "../../lib/articles";
import { NotConfigured } from "./NotConfigured";
import { ArticleCard } from "./ArticleCard";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: {
    eyebrow: "Blog",
    title: "Articole din blog",
    subtitle: "Gânduri, resurse și ghiduri despre psihologie, echilibru și dezvoltare personală.",
    searchPlaceholder: "Caută articole...",
    all: "Toate",
    empty: "Niciun articol găsit.",
    loading: "Se încarcă...",
    read: "min citire",
  },
  en: {
    eyebrow: "Blog",
    title: "From the blog",
    subtitle: "Thoughts, resources and guides on psychology, balance and personal growth.",
    searchPlaceholder: "Search articles...",
    all: "All",
    empty: "No articles found.",
    loading: "Loading...",
    read: "min read",
  },
};

export function BlogList() {
  const { language } = useLanguage();
  const t = copy[language];
  useSeo({
    title: { ro: "Blog — Psihologie, terapie și echilibru", en: "Blog — Psychology, therapy and balance" },
    description: {
      ro: "Articole despre psihologie, terapie, echilibru emoțional și dezvoltare personală, scrise de Carmen Foia, psiholog în Oradea.",
      en: "Articles on psychology, therapy, emotional balance and personal growth by Carmen Foia, psychologist in Oradea.",
    },
    path: "/blog",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    Promise.all([listPublishedArticles(), listCategories()])
      .then(([a, c]) => {
        setArticles(a);
        setCategories(c);
      })
      .catch((e) => setError(e.message ?? String(e)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCat = activeCat === "all" || a.category_id === activeCat;
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = [
        title(a, language),
        excerpt(a, language),
        catName(a.category, language),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, activeCat, query, language]);

  if (!isSupabaseConfigured) {
    return (
      <Shell t={t}>
        <NotConfigured />
      </Shell>
    );
  }

  return (
    <Shell t={t}>
      {/* Controls */}
      <div className="mb-10 flex flex-col gap-5">
        <div className="relative max-w-md">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f95]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-[#e4dcd3] bg-white py-3 pl-11 pr-4 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:ring-2 focus:ring-[#006960]/15"
            style={FONT}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <CategoryChip label={t.all} active={activeCat === "all"} onClick={() => setActiveCat("all")} />
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              label={catName(c, language)}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-[#5c554d]" style={FONT}>{t.loading}</p>
      ) : error ? (
        <p className="text-[#d32c26]" style={FONT}>{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#5c554d]" style={FONT}>{t.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ t, children }: { t: typeof copy.ro; children: React.ReactNode }) {
  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <HomeLink />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>
            {t.eyebrow}
          </span>
          <h1 className="mt-3 text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}>
            {t.title}
          </h1>
          <p className="mt-4 max-w-[640px] text-base leading-7 text-[#5c554d]" style={FONT}>{t.subtitle}</p>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-[#006960] bg-[#006960] text-white"
          : "border-[#e4dcd3] bg-white text-[#39342e] hover:border-[#006960] hover:text-[#006960]",
      ].join(" ")}
      style={FONT}
    >
      {label}
    </button>
  );
}
