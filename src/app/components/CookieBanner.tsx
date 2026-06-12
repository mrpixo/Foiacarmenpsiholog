import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useLanguage } from "../i18n";
import { useConsent, type ConsentCategories } from "../lib/consent";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: {
    title: "Acest site folosește cookie-uri",
    body: "Folosim cookie-uri esențiale pentru funcționarea site-ului și, cu acordul tău, cookie-uri opționale pentru analiză și marketing. Poți accepta tot, respinge cookie-urile opționale sau să-ți personalizezi alegerea.",
    acceptAll: "Acceptă toate",
    rejectAll: "Doar esențiale",
    customize: "Personalizează",
    save: "Salvează preferințele",
    privacy: "Politica de confidențialitate",
    prefsTitle: "Preferințe cookie-uri",
    essential: "Cookie-uri esențiale",
    essentialDesc: "Necesare pentru funcționarea site-ului și a programărilor. Nu pot fi dezactivate.",
    always: "Mereu active",
    analytics: "Analiză",
    analyticsDesc: "Ne ajută să înțelegem cum este folosit site-ul (ex. Google Analytics).",
    marketing: "Marketing",
    marketingDesc: "Folosite pentru a personaliza conținutul și reclamele.",
  },
  en: {
    title: "This website uses cookies",
    body: "We use essential cookies to run the site and, with your consent, optional cookies for analytics and marketing. You can accept all, reject optional cookies, or customise your choice.",
    acceptAll: "Accept all",
    rejectAll: "Essential only",
    customize: "Customise",
    save: "Save preferences",
    privacy: "Privacy Policy",
    prefsTitle: "Cookie preferences",
    essential: "Essential cookies",
    essentialDesc: "Required for the site and bookings to work. These cannot be turned off.",
    always: "Always on",
    analytics: "Analytics",
    analyticsDesc: "Help us understand how the site is used (e.g. Google Analytics).",
    marketing: "Marketing",
    marketingDesc: "Used to personalise content and ads.",
  },
};

export function CookieBanner() {
  const { language } = useLanguage();
  const t = copy[language];
  const { decided, save, settingsOpen, openSettings, closeSettings } = useConsent();

  // Show the bottom banner only before a decision (and when prefs aren't open).
  const showBanner = !decided && !settingsOpen;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[120] md:inset-x-auto md:left-6 md:bottom-6 md:max-w-[440px]"
            role="dialog"
            aria-label={t.title}
            style={FONT}
          >
            <div className="rounded-3xl border border-[#e4dcd3] bg-white p-6 shadow-[0_12px_50px_rgba(0,0,0,0.18)]">
              <h2 className="text-lg font-bold text-[#39342e]">{t.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5c554d]">
                {t.body}{" "}
                <Link to="/privacy" className="font-semibold text-[#006960] underline">
                  {t.privacy}
                </Link>
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => save({ analytics: true, marketing: true })} className={btnPrimary}>
                  {t.acceptAll}
                </button>
                <button type="button" onClick={() => save({ analytics: false, marketing: false })} className={btnSecondary}>
                  {t.rejectAll}
                </button>
                <button type="button" onClick={openSettings} className={btnGhost}>
                  {t.customize}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && <PreferencesModal t={t} onClose={closeSettings} onSave={save} />}
      </AnimatePresence>
    </>
  );
}

function PreferencesModal({
  t,
  onClose,
  onSave,
}: {
  t: typeof copy.ro;
  onClose: () => void;
  onSave: (c: ConsentCategories) => void;
}) {
  const { consent } = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4"
      style={FONT}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e4dcd3] px-6 py-4">
          <h2 className="text-lg font-bold text-[#39342e]">{t.prefsTitle}</h2>
          <button type="button" onClick={onClose} className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#5c554d] hover:bg-[#f5eee9]">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <Row title={t.essential} desc={t.essentialDesc} locked lockedLabel={t.always} />
          <Row title={t.analytics} desc={t.analyticsDesc} checked={analytics} onChange={setAnalytics} />
          <Row title={t.marketing} desc={t.marketingDesc} checked={marketing} onChange={setMarketing} />
        </div>

        <div className="flex justify-end gap-2 border-t border-[#e4dcd3] px-6 py-4">
          <button type="button" onClick={() => onSave({ analytics: false, marketing: false })} className={btnSecondary}>
            {t.rejectAll}
          </button>
          <button type="button" onClick={() => onSave({ analytics, marketing })} className={btnPrimary}>
            {t.save}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({
  title,
  desc,
  checked,
  onChange,
  locked,
  lockedLabel,
}: {
  title: string;
  desc: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
  lockedLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#e4dcd3] bg-[#faf6f2] p-4">
      <div>
        <p className="font-semibold text-[#39342e]">{title}</p>
        <p className="mt-0.5 text-sm leading-6 text-[#5c554d]">{desc}</p>
      </div>
      {locked ? (
        <span className="shrink-0 rounded-full bg-[#006960]/10 px-3 py-1 text-xs font-semibold text-[#006960]">
          {lockedLabel}
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={!!checked}
          onClick={() => onChange?.(!checked)}
          className={[
            "relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
            checked ? "bg-[#006960]" : "bg-[#d6cdc3]",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 size-5 rounded-full bg-white transition-all",
              checked ? "left-[22px]" : "left-0.5",
            ].join(" ")}
          />
        </button>
      )}
    </div>
  );
}

const btnPrimary =
  "cursor-pointer rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#054943]";
const btnSecondary =
  "cursor-pointer rounded-full border border-[#006960] bg-white px-5 py-2.5 text-sm font-semibold text-[#006960] transition-colors hover:bg-[#006960]/8";
const btnGhost =
  "cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-[#5c554d] transition-colors hover:text-[#006960]";
