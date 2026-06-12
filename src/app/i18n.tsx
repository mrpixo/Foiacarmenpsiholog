import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Language = "ro" | "en";

const STORAGE_KEY = "cf-lang";

function readStored(): Language | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "ro" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Romanian; refined by geo-IP on first visit (see effect below).
  const [language, setLang] = useState<Language>(() => readStored() ?? "ro");
  const decided = useRef(readStored() !== null);

  // First visit with no stored choice → detect country. Romania → ro, else en.
  useEffect(() => {
    if (decided.current) return;
    let cancelled = false;
    fetch("https://ipapi.co/country/")
      .then((r) => r.text())
      .then((code) => {
        if (cancelled || decided.current) return;
        const lang: Language = code.trim().toUpperCase() === "RO" ? "ro" : "en";
        setLang(lang);
        try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
      })
      .catch(() => { /* keep default on failure */ });
    return () => { cancelled = true; };
  }, []);

  const setLanguage = (l: Language) => {
    decided.current = true;
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    setLang(l);
  };

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
