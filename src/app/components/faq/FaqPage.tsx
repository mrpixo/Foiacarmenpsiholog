import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { listPublishedFaq, faqQuestion, faqAnswer, faqCategory, type Faq } from "../../lib/community";
import { FaqItem } from "./FaqItem";
import { HomeLink } from "../HomeLink";
import { useSeo } from "../../lib/seo";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: { eyebrow: "Ajutor", title: "Întrebări frecvente", subtitle: "Răspunsuri rapide la cele mai comune întrebări despre procesul terapeutic.", uncategorised: "Altele", empty: "Nicio întrebare încă.", noResults: "Nicio întrebare găsită.", searchPlaceholder: "Caută în întrebări...", loading: "Se încarcă..." },
  en: { eyebrow: "Help", title: "Frequently asked questions", subtitle: "Quick answers to the most common questions about the therapy process.", uncategorised: "Other", empty: "No questions yet.", noResults: "No questions found.", searchPlaceholder: "Search questions...", loading: "Loading..." },
};

export function FaqPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string>("");
  const [query, setQuery] = useState("");

  // FAQPage structured data — ideal for AI answers / rich results. Built from
  // the published FAQs and captured by the prerenderer.
  const jsonLd = useMemo(
    () =>
      faqs.length
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: language,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: faqQuestion(f, language),
              acceptedAnswer: {
                "@type": "Answer",
                text: faqAnswer(f, language).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
              },
            })),
          }
        : null,
    [faqs, language],
  );

  useSeo({
    title: { ro: "Întrebări frecvente — Psiholog Oradea", en: "FAQ — Psychologist in Oradea" },
    description: {
      ro: "Răspunsuri la întrebări frecvente despre ședințe, programări, confidențialitate și terapie cu Carmen Foia, psiholog în Oradea.",
      en: "Answers to frequently asked questions about sessions, bookings, confidentiality and therapy with Carmen Foia, psychologist in Oradea.",
    },
    path: "/intrebari-frecvente",
    jsonLd,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    listPublishedFaq().then(setFaqs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Standard keyword search (question + answer + category), then group by category.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? faqs.filter((f) =>
          [faqQuestion(f, language), faqAnswer(f, language), faqCategory(f, language)]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : faqs;
    const map = new Map<string, Faq[]>();
    for (const f of filtered) {
      const cat = faqCategory(f, language).trim() || t.uncategorised;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(f);
    }
    return Array.from(map.entries());
  }, [faqs, language, query, t.uncategorised]);

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <HomeLink />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>{t.eyebrow}</span>
          <h1 className="mt-3 text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}>{t.title}</h1>
          <p className="mt-4 max-w-[640px] text-base leading-7 text-[#5c554d]" style={FONT}>{t.subtitle}</p>
        </motion.div>

        {/* Search — same control + UX as the blog */}
        <div className="relative mb-10 max-w-md">
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

        {loading ? (
          <p className="text-[#5c554d]" style={FONT}>{t.loading}</p>
        ) : groups.length === 0 ? (
          <p className="text-[#5c554d]" style={FONT}>{query.trim() ? t.noResults : t.empty}</p>
        ) : (
          <div className="flex flex-col gap-12">
            {groups.map(([category, items]) => (
              <div key={category}>
                <h2 className="mb-5 text-[#006960]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(22px,2.6vw,32px)" }}>{category}</h2>
                <div className="flex flex-col gap-3">
                  {items.map((faq) => (
                    <FaqItem
                      key={faq.id}
                      question={faqQuestion(faq, language)}
                      answer={faqAnswer(faq, language)}
                      index={0}
                      isOpen={openId === faq.id}
                      onToggle={() => setOpenId((c) => (c === faq.id ? "" : faq.id))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
