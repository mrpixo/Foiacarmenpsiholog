import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Check, RotateCcw, Phone, LifeBuoy } from "lucide-react";
import { useLanguage } from "../../i18n";
import { bandForScore, bandIn, safetyTriggered, type ScreeningTest, type BandTone } from "../../lib/tests";
import { submitTest } from "../../lib/tests-submit";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const toneStyles: Record<BandTone, { text: string; bg: string }> = {
  good: { text: "#006960", bg: "rgba(0,105,96,0.08)" },
  moderate: { text: "#b06a12", bg: "rgba(255,186,104,0.20)" },
  concern: { text: "#c0392b", bg: "rgba(211,44,38,0.08)" },
};

const copy = {
  ro: {
    yourResult: "Rezultatul tău",
    of: "din",
    bookCta: "Programează o ședință",
    bookSub: "Discută cu Carmen despre ce arată rezultatul tău.",
    otherTests: "Încearcă alt test",
    orBook: "sau programează o ședință",
    emailTitle: "Primește rezultatele pe email",
    emailSub: "Îți trimitem un rezumat al rezultatului tău.",
    emailPh: "adresa ta de email",
    consentResults: "Sunt de acord să primesc rezultatele pe email.",
    consentMarketing: "Vreau să primesc și articole, resurse și noutăți (opțional).",
    send: "Trimite-mi rezultatele",
    sending: "Se trimite…",
    sent: "Gata! Verifică-ți emailul în scurt timp.",
    errorMsg: "Momentan nu am putut trimite emailul. Încearcă din nou mai târziu.",
    privacy: "Îți respectăm confidențialitatea. Vezi",
    privacyLink: "Politica de confidențialitate",
    restart: "Reia testul",
  },
  en: {
    yourResult: "Your result",
    of: "of",
    bookCta: "Book a session",
    bookSub: "Talk to Carmen about what your result shows.",
    otherTests: "Try another test",
    orBook: "or book a session",
    emailTitle: "Get your results by email",
    emailSub: "We'll send you a summary of your result.",
    emailPh: "your email address",
    consentResults: "I agree to receive my results by email.",
    consentMarketing: "I'd also like to receive articles, resources and news (optional).",
    send: "Email me my results",
    sending: "Sending…",
    sent: "Done! Check your inbox shortly.",
    errorMsg: "We couldn't send the email right now. Please try again later.",
    privacy: "We respect your privacy. See our",
    privacyLink: "Privacy policy",
    restart: "Retake the test",
  },
};

export function TestResult({
  test,
  answers,
  onRestart,
}: {
  test: ScreeningTest;
  answers: number[];
  onRestart: () => void;
}) {
  const { language } = useLanguage();
  const t = copy[language];
  const showSafety = safetyTriggered(test, answers);

  const isMulti = !!test.dimensions?.length;
  const dims = isMulti
    ? test.dimensions!.map((d) => {
        const s = d.score(answers);
        return { d, s, b: bandIn(d.bands, s) };
      })
    : [];
  const score = isMulti ? 0 : test.score!(answers);
  const band = isMulti ? null : bandForScore(test, score);
  const overallTone: BandTone = isMulti
    ? dims.some((x) => x.b.tone === "concern")
      ? "concern"
      : dims.some((x) => x.b.tone === "moderate")
        ? "moderate"
        : "good"
    : band!.tone;
  const tone = toneStyles[overallTone];
  const pushBooking = overallTone !== "good";

  // Values sent to the backend (single: real score + band; multi: 0 + summary).
  const submitBand = isMulti ? overallTone : band!.label.en;
  const submitMessage = isMulti
    ? dims.map((x) => `${x.d.name[language]}: ${x.b.label[language]}`).join(" · ")
    : band!.message[language];

  const [email, setEmail] = useState("");
  const [consentResults, setConsentResults] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !consentResults) return;
    setStatus("sending");
    const res = await submitTest({
      slug: test.slug,
      testName: test.name[language],
      score,
      band: submitBand,
      message: submitMessage,
      locale: language,
      email: email.trim(),
      marketingConsent: consentMarketing,
    });
    setStatus(res.ok ? "sent" : "error");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Safety protocol — leads the result if a sensitive item was endorsed. */}
      {showSafety && test.safety && (
        <div className="mb-8 rounded-3xl border-2 border-[#d32c26]/25 bg-[#d32c26]/5 p-6 md:p-7">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d32c26]/10 text-[#c0392b]">
              <LifeBuoy size={20} />
            </span>
            <div>
              <p className="text-[17px] font-semibold leading-7 text-[#39342e]" style={FONT}>{test.safety.title[language]}</p>
              <p className="mt-2 text-[15px] leading-7 text-[#5c554d]" style={FONT}>{test.safety.body[language]}</p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                {test.safety.resources.map((r) => (
                  <a
                    key={r.value}
                    href={r.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a93226]"
                    style={FONT}
                  >
                    <Phone size={15} /> {r.label[language]}: {r.value}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>{t.yourResult}</span>

      {isMulti ? (
        /* Multi-dimension profile (DASS-21 subscales, Big Five traits) */
        <div className="mt-4 flex flex-col gap-6">
          {dims.map(({ d, s, b }) => {
            const dt = toneStyles[b.tone];
            const pct = Math.round((s / d.scoreMax) * 100);
            return (
              <div key={d.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-semibold text-[#39342e]" style={FONT}>{d.name[language]}</span>
                  <span className="text-sm font-semibold" style={{ ...FONT, color: dt.text }}>{b.label[language]}</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#39342e]/10">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: dt.text }} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5c554d]" style={FONT}>{b.message[language]}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col items-start gap-4 rounded-3xl p-8" style={{ background: tone.bg }}>
            <div className="flex items-end gap-2" style={FONT}>
              <span className="text-[64px] font-bold leading-none" style={{ color: tone.text }}>{score}</span>
              <span className="mb-2 text-lg text-[#5c554d]">{t.of} {test.scoreMax}</span>
            </div>
            <span className="rounded-full px-4 py-1.5 text-sm font-semibold" style={{ ...FONT, color: tone.text, background: "rgba(255,255,255,0.6)" }}>
              {band!.label[language]}
            </span>
          </div>
          <p className="mt-6 text-[17px] leading-8 text-[#39342e]" style={FONT}>{band!.message[language]}</p>
        </>
      )}

      {/* Score-based CTA */}
      <div className="mt-8 flex flex-col items-start gap-3">
        {pushBooking ? (
          <>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:hover:scale-105"
              style={FONT}
            >
              {t.bookCta}
            </Link>
            <p className="text-sm text-[#5c554d]" style={FONT}>{t.bookSub}</p>
          </>
        ) : (
          <>
            <Link
              to="/teste"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:w-auto md:hover:scale-105"
              style={FONT}
            >
              {t.otherTests}
            </Link>
            <Link to="/contact" className="text-sm font-medium text-[#006960] underline underline-offset-4 transition-colors hover:text-[#054943]" style={FONT}>
              {t.orBook}
            </Link>
          </>
        )}
      </div>

      {/* Email capture */}
      <form onSubmit={onSubmit} className="mt-12 rounded-3xl border border-[#e4dcd3] bg-white p-7 md:p-8" style={FONT}>
        <h2 className="text-xl font-semibold text-[#39342e]">{t.emailTitle}</h2>
        <p className="mt-1 text-sm text-[#5c554d]">{t.emailSub}</p>

        {status === "sent" ? (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#006960]/8 px-4 py-2 text-sm font-semibold text-[#006960]">
            <Check size={16} /> {t.sent}
          </p>
        ) : (
          <>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPh}
              className="mt-5 w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15"
            />

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-[#5c554d]">
              <input type="checkbox" required checked={consentResults} onChange={(e) => setConsentResults(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#006960]" />
              <span>{t.consentResults}</span>
            </label>
            {!showSafety && (
              <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-[#5c554d]">
                <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#006960]" />
                <span>{t.consentMarketing}</span>
              </label>
            )}

            {status === "error" && <p className="mt-3 text-sm font-medium text-[#d32c26]">{t.errorMsg}</p>}

            <button
              type="submit"
              disabled={status === "sending" || !email.trim() || !consentResults}
              className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#006960] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#054943] disabled:opacity-40"
            >
              {status === "sending" ? t.sending : t.send}
            </button>

            <p className="mt-4 text-xs leading-5 text-[#5c554d]/80">
              {t.privacy}{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-[#006960]">{t.privacyLink}</Link>.
            </p>
          </>
        )}
      </form>

      <p className="mt-8 text-sm leading-6 text-[#5c554d]/80">{test.disclaimer[language]}</p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]"
        style={FONT}
      >
        <RotateCcw size={15} /> {t.restart}
      </button>
    </motion.div>
  );
}
