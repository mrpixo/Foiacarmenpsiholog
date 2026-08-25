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
  cabinet: "sesiune-terapie-gratuita-la-cabinet",
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
    id: "consiliere-individuala",
    label: { ro: "Consiliere psihologică individuală", en: "Individual psychological counselling" },
    description: {
      ro: "Sprijin personalizat pentru dificultăți emoționale, stres, anxietate și perioade de schimbare.",
      en: "Personalized support for emotional difficulties, stress, anxiety, and periods of change.",
    },
  },
  {
    id: "consiliere-copii-adolescenti",
    label: { ro: "Consiliere psihologică pentru copii și adolescenți", en: "Counselling for children and adolescents" },
    description: {
      ro: "Sprijin adaptat vârstei pentru emoții, anxietate, învățare, relații, încredere în sine și provocări școlare.",
      en: "Age-appropriate support for emotions, anxiety, learning, relationships, self-confidence, and school challenges.",
    },
  },
  {
    id: "anxietate-performanta",
    label: { ro: "Consiliere pe anxietatea de performanță", en: "Performance-anxiety counselling" },
    description: {
      ro: "Gestionarea anxietății, presiunii și blocajelor de performanță — sportivi, lideri, profesioniști, studenți, elevi.",
      en: "Managing anxiety, pressure, and performance blocks — athletes, leaders, professionals, students, pupils.",
    },
  },
  {
    id: "motivatie-obiective",
    label: { ro: "Consiliere motivație și atingerea obiectivelor", en: "Motivation & goal achievement" },
    description: {
      ro: "Motivația, atingerea obiectivelor și susținerea progresului.",
      en: "Motivation, achieving goals, and sustaining progress.",
    },
  },
  {
    id: "evaluare-psihologica",
    label: { ro: "Evaluare psihologică", en: "Psychological assessment" },
    description: {
      ro: "Evaluare pe diverse arii de autocunoaștere (personalitate, scheme cognitive, atașament, inteligență, anxietate, stres, etc.).",
      en: "Assessment across areas of self-knowledge (personality, cognitive schemas, attachment, intelligence, anxiety, stress, etc.).",
    },
  },
  {
    id: "workshopuri-companii",
    label: { ro: "Workshopuri pentru companii și organizații", en: "Workshops for companies and organizations" },
    description: {
      ro: "Programe de grup pe teme de stres, comunicare, motivație, wellbeing și dezvoltare profesională.",
      en: "Group programs on stress, communication, motivation, wellbeing, and professional development.",
    },
  },
  {
    id: "workshopuri-copii-adolescenti",
    label: { ro: "Workshopuri pentru copii și adolescenți", en: "Workshops for children and adolescents" },
    description: {
      ro: "Programe interactive și psihoeducaționale pentru emoții, încredere, motivație, relații și dezvoltare personală.",
      en: "Interactive, psycho-educational programs for emotions, confidence, motivation, relationships, and personal development.",
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
