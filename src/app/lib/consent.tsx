import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * GDPR cookie consent.
 *
 * Essential cookies are always allowed (needed for the site/booking to work).
 * Optional categories (analytics, marketing) are OFF until the user opts in,
 * and nothing in those categories is loaded before consent is given.
 */
export type ConsentCategories = { analytics: boolean; marketing: boolean };

const STORAGE_KEY = "cf-cookie-consent-v1";

// GA4 measurement id (e.g. "G-XXXXXXX"). Set VITE_GA_MEASUREMENT_ID in the
// environment (Vercel → Settings → Environment Variables, and .env locally).
// While empty, no analytics scripts load even if the user consents.
const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? "";

type StoredConsent = ConsentCategories & { decidedAt: string };

type ConsentCtx = {
  consent: ConsentCategories | null; // null = no decision yet
  decided: boolean;
  save: (c: ConsentCategories) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const Ctx = createContext<ConsentCtx | null>(null);

function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || document.getElementById("ga-src")) return;
  const s = document.createElement("script");
  s.id = "ga-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  const inline = document.createElement("script");
  inline.id = "ga-init";
  inline.innerHTML =
    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
    `gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`;
  document.head.appendChild(inline);
}

function readStored(): ConsentCategories | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentCategories | null>(() => readStored());
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply consent: load analytics only when allowed.
  useEffect(() => {
    if (consent?.analytics) loadGoogleAnalytics();
  }, [consent]);

  const save = (c: ConsentCategories) => {
    setConsent(c);
    try {
      const stored: StoredConsent = { ...c, decidedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable — consent still applies for this session */
    }
    setSettingsOpen(false);
  };

  return (
    <Ctx.Provider
      value={{
        consent,
        decided: consent !== null,
        save,
        settingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider");
  return ctx;
}
