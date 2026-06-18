import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, ArrowLeft, Check, MapPin as Pin, Video } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useLanguage } from "../i18n";
import { CAL_USERNAME, EVENT_SLUG_BY_MODE, bookingReasons, SESSION_PRICE, ENTITY, type BookingReason, type SessionMode } from "../booking";
import { HomeLink } from "./HomeLink";
import { useSeo } from "../lib/seo";

const copy = {
  ro: {
    eyebrow: "Programare",
    title: "Programează o ședință",
    subtitle:
      "Alege tipul de sesiune, apoi un interval disponibil. Plata se face cu cardul, iar confirmarea și bonul fiscal ajung pe email.",
    step1: "1. Alege tipul de sesiune",
    step2: "2. Alege data și ora",
    back: "Înapoi la tipuri de sesiune",
    selected: "Tip sesiune selectat",
    details: "Date de contact",
    location: "Cabinet",
    perSession: "/ ședință",
    paymentNote: "Plata se face securizat cu cardul, la pasul de confirmare.",
    cabinet: "La cabinet",
    online: "Sesiune online",
    locCabinet: "La cabinet · Vasile Alecsandri nr. 7, Oradea",
    locOnline: "Sesiune online · primești link de Google Meet",
  },
  en: {
    eyebrow: "Booking",
    title: "Book a session",
    subtitle:
      "Choose the session type, then an available time slot. Payment is by card, and the confirmation and receipt are emailed to you.",
    step1: "1. Choose the session type",
    step2: "2. Choose a date and time",
    back: "Back to session types",
    selected: "Selected session type",
    details: "Contact details",
    location: "Office",
    perSession: "/ session",
    paymentNote: "Payment is taken securely by card at the confirmation step.",
    cabinet: "In person",
    online: "Online session",
    locCabinet: "In person · Vasile Alecsandri nr. 7, Oradea",
    locOnline: "Online · you'll receive a Google Meet link",
  },
};

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const PRICE_LABEL = `${SESSION_PRICE.amount} ${SESSION_PRICE.currency}`;

export function Contact() {
  const { language } = useLanguage();
  const t = copy[language];
  useSeo({
    title: { ro: "Programează o ședință — Psiholog Oradea", en: "Book a session — Psychologist in Oradea" },
    description: {
      ro: "Programează o ședință de terapie sau consiliere cu Carmen Foia, psiholog în Oradea. Alege tipul de sesiune și un interval disponibil.",
      en: "Book a therapy or counselling session with Carmen Foia, psychologist in Oradea. Choose your session type and an available slot.",
    },
    path: "/contact",
  });
  const [searchParams] = useSearchParams();
  // Deep-link support: /contact?reason=<id>&mode=online|cabinet pre-selects and
  // jumps straight to the slot picker. Both are required to reach the picker.
  const initialReason = bookingReasons.find((r) => r.id === searchParams.get("reason")) ?? null;
  const initialMode = (["online", "cabinet"] as const).find((m) => m === searchParams.get("mode")) ?? null;
  const [reason, setReason] = useState<BookingReason | null>(initialReason);
  const [mode, setMode] = useState<SessionMode | null>(initialMode);

  const pick = (r: BookingReason, m: SessionMode) => { setReason(r); setMode(m); };
  const reset = () => { setReason(null); setMode(null); };

  // Initialise the Cal.com embed UI to match the site's branding.
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#006960" }, dark: { "cal-brand": "#006960" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <section className="w-full px-6 pb-24 pt-36 md:px-24 md:pb-[156px] md:pt-44">
      <div className="mx-auto max-w-[1200px]">
        <HomeLink />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[2px] text-[#006960]" style={FONT}>
            {t.eyebrow}
          </span>
          <h1
            className="mt-3 text-[#39342e]"
            style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}
          >
            {t.title}
          </h1>
          <p className="mt-4 max-w-[640px] text-base leading-7 text-[#5c554d]" style={FONT}>
            {t.subtitle}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!(reason && mode) ? (
            /* Step 1 — choose the session type + location */
            <motion.div
              key="reasons"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-6 text-lg font-semibold text-[#39342e]" style={FONT}>
                {t.step1}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookingReasons.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col items-start gap-2 rounded-2xl border-2 border-transparent bg-white p-6 text-left transition-all duration-300 hover:border-[#006960] hover:shadow-[0_8px_30px_rgba(0,105,96,0.1)]"
                  >
                    <span className="text-[17px] font-semibold text-[#39342e]" style={FONT}>
                      {r.label[language]}
                    </span>
                    <span className="text-sm leading-6 text-[#5c554d]" style={FONT}>
                      {r.description[language]}
                    </span>
                    <span className="mt-1 inline-flex items-center rounded-full bg-[#006960]/8 px-3 py-1 text-sm font-semibold text-[#006960]" style={FONT}>
                      {PRICE_LABEL} <span className="ml-1 font-normal text-[#006960]/70">{t.perSession}</span>
                    </span>
                    {/* Location choice — drives the Cal.com event type (online has a Meet link) */}
                    <div className="mt-3 flex w-full flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => pick(r, "cabinet")}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#006960] px-4 py-2 text-sm font-semibold text-[#006960] transition-colors hover:bg-[#006960] hover:text-white"
                        style={FONT}
                      >
                        <Pin size={15} /> {t.cabinet}
                      </button>
                      <button
                        type="button"
                        onClick={() => pick(r, "online")}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#006960] px-4 py-2 text-sm font-semibold text-[#006960] transition-colors hover:bg-[#006960] hover:text-white"
                        style={FONT}
                      >
                        <Video size={15} /> {t.online}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Step 2 — choose a slot (Cal.com handles review, card payment, confirmation + receipt) */
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#006960] transition-colors hover:text-[#054943]"
                  style={FONT}
                >
                  <ArrowLeft size={16} />
                  {t.back}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#006960]/8 px-4 py-2 text-sm font-medium text-[#006960]" style={FONT}>
                    <Check size={15} />
                    {reason.label[language]}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#006960]/8 px-4 py-2 text-sm font-medium text-[#006960]" style={FONT}>
                    {mode === "online" ? <Video size={15} /> : <Pin size={15} />}
                    {mode === "online" ? t.locOnline : t.locCabinet}
                  </span>
                </div>
              </div>

              <h2 className="mb-4 text-lg font-semibold text-[#39342e]" style={FONT}>
                {t.step2}
              </h2>
              <p className="mb-6 text-sm text-[#5c554d]" style={FONT}>
                {t.paymentNote}
              </p>

              <div className="overflow-hidden rounded-3xl border border-[#e4dcd3] bg-white">
                <Cal
                  namespace="booking"
                  calLink={`${CAL_USERNAME}/${EVENT_SLUG_BY_MODE[mode]}`}
                  style={{ width: "100%", height: "100%", overflow: "scroll" }}
                  config={{
                    layout: "month_view",
                    // Start the attendee fields empty — otherwise Cal.com
                    // prefills the logged-in account (the therapist's) when the
                    // site is opened in a browser signed into Cal.com.
                    name: "",
                    email: "",
                    guests: [],
                    // Pass the chosen reason into the booking notes so the
                    // therapist sees what kind of session is coming.
                    notes: `${language === "ro" ? "Tip sesiune" : "Session type"}: ${reason.label[language]}`,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct contact details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid grid-cols-1 gap-6 rounded-3xl bg-[#054943] p-7 text-white sm:grid-cols-3 md:p-10"
        >
          <ContactItem icon={<Phone size={20} />} label="WhatsApp" value="+40 770 926 562" href="tel:+40770926562" />
          <ContactItem icon={<Mail size={20} />} label="Email" value="contact@psihologcarmenfoia.ro" href="mailto:contact@psihologcarmenfoia.ro" />
          <ContactItem icon={<MapPin size={20} />} label={t.location} value={ENTITY.address} />
        </motion.div>

        {/* Legal entity */}
        <p className="mt-6 text-center text-xs text-[#5c554d]/80" style={FONT}>
          {ENTITY.name} · CUI {ENTITY.cui} · {ENTITY.address}
        </p>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const valueEl = href ? (
    <a href={href} className="font-semibold transition-colors hover:text-[#ffba68]">
      {value}
    </a>
  ) : (
    <span className="font-semibold">{value}</span>
  );
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </span>
      <div className="flex flex-col" style={FONT}>
        <span className="text-sm text-white/70">{label}</span>
        {valueEl}
      </div>
    </div>
  );
}
