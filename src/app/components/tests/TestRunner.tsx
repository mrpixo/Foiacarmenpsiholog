import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "../../i18n";
import { getTestBySlug } from "../../lib/tests";
import { HomeLink } from "../HomeLink";
import { useSeo } from "../../lib/seo";
import { TestResult } from "./TestResult";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: {
    begin: "Începe testul",
    back: "Înapoi",
    question: "Întrebarea",
    of: "din",
    allTests: "Toate testele",
    notFound: "Testul nu a fost găsit.",
  },
  en: {
    begin: "Start the test",
    back: "Back",
    question: "Question",
    of: "of",
    allTests: "All tests",
    notFound: "Test not found.",
  },
};

export function TestRunner() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = copy[language];
  const test = slug ? getTestBySlug(slug) : undefined;

  useSeo({
    title: {
      ro: `${test ? test.name.ro : "Test"} — Carmen Foia`,
      en: `${test ? test.name.en : "Test"} — Carmen Foia`,
    },
    description: {
      ro: test ? test.measures.ro : "Test psihologic de auto-evaluare.",
      en: test ? test.measures.en : "Psychological self-assessment test.",
    },
    path: "/teste",
  });

  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!test) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center" style={FONT}>
          <p className="text-lg text-[#39342e]">{t.notFound}</p>
          <Link to="/teste" className="mt-4 inline-block font-semibold text-[#006960] underline underline-offset-4">{t.allTests}</Link>
        </div>
      </section>
    );
  }

  const choose = (value: number) => {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    if (current < test.items.length - 1) setCurrent(current + 1);
    else setPhase("result");
  };

  const goBack = () => {
    if (current === 0) setPhase("intro");
    else setCurrent(current - 1);
  };

  const restart = () => {
    setAnswers([]);
    setCurrent(0);
    setPhase("intro");
  };

  const progress = ((current + 1) / test.items.length) * 100;

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[760px]">
        <HomeLink />

        {phase === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>{test.measures[language]}</span>
            <h1 className="mt-3 text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,4.5vw,56px)", lineHeight: 1.1 }}>{test.name[language]}</h1>
            <p className="mt-5 text-[17px] leading-8 text-[#5c554d]" style={FONT}>{test.intro[language]}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#a89f95]" style={FONT}>
              <Clock size={16} /> {test.durationMin[language]}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setPhase("quiz")}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:hover:scale-105"
                style={FONT}
              >
                {t.begin}
              </button>
            </div>
            <p className="mt-8 max-w-[560px] text-sm leading-6 text-[#5c554d]/80" style={FONT}>{test.disclaimer[language]}</p>
          </motion.div>
        )}

        {phase === "quiz" && (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-sm font-medium text-[#5c554d]" style={FONT}>
                <span>{t.question} {current + 1} {t.of} {test.items.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#006960]/10">
                <motion.div className="h-full rounded-full bg-[#006960]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>

            {test.timeframe && (
              <p className="mb-2 text-sm font-medium uppercase tracking-[1px] text-[#006960]" style={FONT}>{test.timeframe[language]}</p>
            )}

            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[22px] font-semibold leading-8 text-[#39342e] md:text-[26px]" style={FONT}>
                {test.items[current].text[language]}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {test.scale.map((opt) => {
                  const selected = answers[current] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => choose(opt.value)}
                      className={`w-full cursor-pointer rounded-2xl border-2 px-6 py-4 text-left text-[16px] font-medium transition-all duration-200 ${
                        selected
                          ? "border-[#006960] bg-[#006960]/8 text-[#006960]"
                          : "border-[#e4dcd3] bg-white text-[#39342e] hover:border-[#006960] hover:bg-[#006960]/5"
                      }`}
                      style={FONT}
                    >
                      {opt.label[language]}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <button
              type="button"
              onClick={goBack}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]"
              style={FONT}
            >
              <ArrowLeft size={16} /> {t.back}
            </button>
          </div>
        )}

        {phase === "result" && <TestResult test={test} answers={answers} onRestart={restart} />}
      </div>
    </section>
  );
}
