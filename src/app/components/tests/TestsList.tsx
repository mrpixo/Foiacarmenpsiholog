import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../i18n";
import { catalog } from "../../lib/tests";
import { HomeLink } from "../HomeLink";
import { useSeo } from "../../lib/seo";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: {
    eyebrow: "Teste",
    title: "Teste psihologice",
    subtitle: "Chestionare scurte de auto-evaluare, cu rezultat imediat. Alege un test pentru a începe.",
    disclaimer: "Instrumente de auto-evaluare, nu diagnostic. Rezultatele au scop informativ și nu înlocuiesc consultul unui specialist.",
    duration: "Durată",
    start: "Începe testul",
    soon: "În curând",
  },
  en: {
    eyebrow: "Tests",
    title: "Psychological tests",
    subtitle: "Short self-assessment questionnaires with an instant result. Pick a test to begin.",
    disclaimer: "Self-assessment tools, not a diagnosis. Results are for information only and don't replace a consultation with a specialist.",
    duration: "Duration",
    start: "Start the test",
    soon: "Coming soon",
  },
};

export function TestsList() {
  const { language } = useLanguage();
  const t = copy[language];
  useSeo({
    title: { ro: "Teste psihologice — Carmen Foia", en: "Psychological tests — Carmen Foia" },
    description: {
      ro: "Chestionare scurte de auto-evaluare: stare de bine, anxietate, dispoziție, stimă de sine și personalitate. Rezultat imediat.",
      en: "Short self-assessment questionnaires: well-being, anxiety, mood, self-esteem and personality. Instant result.",
    },
    path: "/teste",
  });

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <HomeLink />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>{t.eyebrow}</span>
          <h1 className="mt-3 text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}>{t.title}</h1>
          <p className="mt-4 max-w-[640px] text-base leading-7 text-[#5c554d]" style={FONT}>{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((test) => {
            const inner = (
              <>
                <div className="flex w-full items-start justify-between gap-3">
                  <span className="text-[20px] font-semibold text-[#39342e]" style={FONT}>{test.name[language]}</span>
                  {test.comingSoon && (
                    <span className="shrink-0 rounded-full bg-[#006960]/8 px-3 py-1 text-xs font-semibold text-[#006960]" style={FONT}>{t.soon}</span>
                  )}
                </div>
                <span className="text-sm leading-6 text-[#5c554d]" style={FONT}>{test.measures[language]}</span>
                <span className="mt-1 text-sm text-[#a89f95]" style={FONT}>{t.duration}: {test.durationMin[language]}</span>
                {!test.comingSoon && (
                  <span className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#006960]" style={FONT}>
                    {t.start} <ArrowRight size={18} />
                  </span>
                )}
              </>
            );
            const base = "flex h-full flex-col items-start gap-2 rounded-2xl border-2 bg-white p-6 text-left transition-all duration-300";
            return test.comingSoon ? (
              <div key={test.slug} className={`${base} cursor-default border-transparent opacity-70`}>{inner}</div>
            ) : (
              <Link
                key={test.slug}
                to={`/teste/${test.slug}`}
                className={`${base} border-transparent hover:border-[#006960] hover:shadow-[0_8px_30px_rgba(0,105,96,0.1)]`}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-sm text-[#5c554d]/80" style={FONT}>{t.disclaimer}</p>
      </div>
    </section>
  );
}
