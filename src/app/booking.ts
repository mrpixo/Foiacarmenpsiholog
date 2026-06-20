/**
 * Booking configuration.
 *
 * The booking flow is powered by Cal.com Cloud, which handles availability
 * (synced from Google Calendar), card payment (Stripe), confirmation + receipt
 * emails, calendar invites with both participants, and the 2-hour reminders.
 *
 * SETUP (done once in the Cal.com dashboard — see BOOKING_SETUP.md):
 *  1. Create the account and set CAL_USERNAME below.
 *  2. Connect Google Calendar (App Store → Google Calendar) for 2-way sync.
 *  3. Connect Stripe (App Store → Stripe) so cards can be charged.
 *  4. Create one Event Type per reason below, set its price + duration,
 *     enable the Stripe payment requirement, and add a reminder workflow
 *     "2 hours before" for attendee + host.
 *  5. Replace each `slug` here with the event type's slug.
 */

export const CAL_USERNAME = "psiholog-carmen-foia";

/**
 * Cal.com event types. Each session can be booked online (Google Meet link in
 * the calendar invite) or in person (cabinet address, no link) — these map to
 * two separate event types so the chosen location is enforced by Cal.com.
 * The chosen reason is passed into the booking notes.
 */
export type SessionMode = "online" | "cabinet";

export const EVENT_SLUG_BY_MODE: Record<SessionMode, string> = {
  online: "sesiune-terapie-online",
  cabinet: "sesiune-terapie-cabinet",
};

/**
 * Free session event types — booked instead of the paid ones when a valid promo
 * code is applied. One per mode (price 0), each with a single location so the
 * booker isn't asked to pick again: online → Google Meet, cabinet → In Person.
 */
export const FREE_EVENT_SLUG_BY_MODE: Record<SessionMode, string> = {
  online: "sesiune-terapie-gratuita-online",
  cabinet: "sesiune-terapie-gratuita-cabinet",
};

/** Standard price per session, charged by card via Stripe. Display-only here;
 *  the authoritative amount is set on each Cal.com event type. */
export const SESSION_PRICE = { amount: 150, currency: "RON" } as const;

/** Legal entity invoiced on the Stripe receipt / invoice. */
export const ENTITY = {
  name: "Cabinet Individual Psihologie Carmen Foia",
  cui: "54513889",
  address: "Vasile Alecsandri nr. 7, Oradea",
} as const;

export type BookingReason = {
  /** Stable id; sent in the booking notes so the therapist knows the reason. */
  id: string;
  label: { ro: string; en: string };
  description: { ro: string; en: string };
};

export const bookingReasons: BookingReason[] = [
  {
    id: "psihologie-sportiva",
    label: { ro: "Psihologie sportivă", en: "Sports psychology" },
    description: {
      ro: "Sesiuni 1-la-1 pentru a gestiona presiunea și anxietatea în sport.",
      en: "One-to-one sessions to manage pressure and anxiety in sport.",
    },
  },
  {
    id: "orientare-vocationala",
    label: { ro: "Orientare vocațională", en: "Vocational guidance" },
    description: {
      ro: "Consiliere pentru claritate profesională și decizii asumate.",
      en: "Counselling for career clarity and confident decisions.",
    },
  },
  {
    id: "anxietate-performanta",
    label: { ro: "Anxietate de performanță", en: "Performance anxiety" },
    description: {
      ro: "Strategii pentru reglare emoțională, focus și încredere.",
      en: "Tools for emotional regulation, focus, and self-trust.",
    },
  },
  {
    id: "terapie-individuala",
    label: { ro: "Terapie individuală", en: "Individual therapy" },
    description: {
      ro: "Sesiuni personalizate pentru autocunoaștere și echilibru.",
      en: "Tailored sessions for self-awareness and balance.",
    },
  },
  {
    id: "terapie-cuplu",
    label: { ro: "Terapie de cuplu", en: "Couples therapy" },
    description: {
      ro: "Sprijin pentru comunicare, reconectare și înțelegere reciprocă.",
      en: "Support for communication, reconnection, and understanding.",
    },
  },
  {
    id: "dezvoltare-personala",
    label: { ro: "Dezvoltare personală", en: "Personal development" },
    description: {
      ro: "Programe de autocunoaștere pentru a-ți atinge potențialul.",
      en: "Self-discovery programs to help you reach your potential.",
    },
  },
  {
    id: "altul",
    label: { ro: "Altul", en: "Other" },
    description: {
      ro: "Ai un alt motiv? Programează o ședință și discutăm.",
      en: "Have a different reason? Book a session and we'll talk.",
    },
  },
];
