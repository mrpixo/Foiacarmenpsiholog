# Booking setup (Cal.com)

The booking flow on `/contact` is powered by **Cal.com Cloud**. The website only
renders the booking UI — everything server-side (availability from Google
Calendar, card payments, confirmation + receipt emails, calendar invites with
both participants, and the 2-hour reminders) is handled by Cal.com and is
configured **once** in the Cal.com dashboard.

No backend hosting of your own is required. The site can stay on static hosting.

## One-time setup

1. **Create a Cal.com account** at https://cal.com (the free plan supports paid
   bookings; paid plans add team features you likely don't need).
   - Note your username. Put it in `src/app/booking.ts` → `CAL_USERNAME`.

2. **Connect Google Calendar** — Dashboard → Apps → install *Google Calendar*.
   - This gives 2-way sync: your existing calendar events block availability,
     and new bookings are written back as events.
   - In *Availability*, set your working hours; busy events in Google Calendar
     are automatically excluded.

3. **Connect Stripe** — Dashboard → Apps → install *Stripe*, connect your
   Stripe account. This is the card the payments are paid into. Cards are the
   only payment method (no other method is enabled).

4. **Create one Event Type per booking reason.** The site expects these slugs
   (Event Type → URL/slug must match exactly — edit them in `src/app/booking.ts`
   if you prefer different ones):

   | Reason (RO)              | slug                    |
   |--------------------------|-------------------------|
   | Psihologie sportivă      | `psihologie-sportiva`   |
   | Orientare vocațională    | `orientare-vocationala` |
   | Anxietate de performanță | `anxietate-performanta` |
   | Terapie individuală      | `terapie-individuala`   |
   | Terapie de cuplu         | `terapie-cuplu`         |
   | Dezvoltare personală     | `dezvoltare-personala`  |

   For each Event Type:
   - Set the **duration**.
   - Set **location** (e.g. in-person address, or Google Meet for online).
   - Under **Apps / Payment**, enable **Stripe** and set the **price** to
     **150 RON** (the single standard price for every session). The attendee
     must pay to confirm — Cal.com shows the review + payment step and only
     books once payment succeeds.
   - Invoice the legal entity: **Cabinet Individual Psihologie Carmen Foia**,
     **CUI 54513889**, Vasile Alecsandri nr. 7, Oradea (set this in Stripe →
     Settings → Business/Invoicing so it appears on the receipt/invoice).
   - Confirmation email + Stripe receipt are sent automatically on success.

5. **Reminders 2 hours before** — Dashboard → **Workflows** → New workflow:
   - Trigger: *Before event starts* → **2 hours**.
   - Action: *Send email* to **Attendee**, and add a second action to **Host**
     (you). Apply the workflow to all six event types.

6. **Receipt as attachment** — Stripe emails the card receipt to the attendee.
   To attach a PDF invoice to Cal.com's own confirmation email, enable
   *Invoices* in Stripe (Settings → Invoicing) so a PDF is generated per charge.

## What's already done in code

- `/contact` shows the reason picker, then embeds the Cal.com scheduler for the
  single `terapie` event type (`@calcom/embed-react`), styled with the site's
  green brand.
- The embed handles slot selection → review → card payment → confirmation.
- The chosen reason is passed into the booking **notes** (e.g. "Motiv: Terapie
  de cuplu") so the therapist knows what kind of session is coming.
- `src/app/booking.ts` holds `CAL_USERNAME` (`psiholog-carmen-foia`),
  `EVENT_SLUG` (`terapie`), `SESSION_PRICE` (150 RON), `ENTITY`, and the reasons.

## Status

- ✅ Cal.com account + single "Terapie" event type (150 RON via Stripe).
- ✅ Site wired to it; the 404 is resolved.
- ⏳ **Payment blocked until Stripe is verified.** A test booking returns
  "Payment could not be created" because the Stripe account is not yet
  activated for charges. This is expected and resolves once Stripe finishes
  business verification — no code change needed.

## Troubleshooting: "Payment could not be created"

Caused by Stripe refusing the charge, almost always:
1. **Stripe account not activated** — complete business verification (entity +
   CUI + identity + bank IBAN). Until `charges_enabled = true`, live payments
   fail. ← current blocker.
2. **Test/live mode mismatch** — the Stripe↔Cal.com connection mode must match
   the mode the booking is made in. To test for free, put Stripe in **Test
   mode**, reconnect it in Cal.com, and pay with card `4242 4242 4242 4242`.

## To finish (once Stripe is verified)

1. Turn **off** "Requires confirmation" on the event (Advanced tab) so paid
   bookings auto-confirm.
2. Run a test booking; confirm: payment succeeds, confirmation emails to both
   parties, Stripe receipt to client, event in Google Calendar with both
   participants + a 2-hour reminder.
