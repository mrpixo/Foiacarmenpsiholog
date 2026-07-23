import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
// Muted body colour from the Figma "Despre mine" design.
const MUTED = "rgba(29,41,61,0.7)";

// Bold emphasis inside card bodies (matches the Figma).
const B = ({ children }: { children: ReactNode }) => <strong className="font-bold">{children}</strong>;

// Bold inline link into the booking page (Contact).
const BookLink = ({ children }: { children: ReactNode }) => (
  <Link
    to="/contact"
    className="font-bold text-[#006960] underline underline-offset-2 transition-colors hover:text-[#054943]"
  >
    {children}
  </Link>
);

type Card = { title: string; body: ReactNode; icon: string };

const copy: Record<"ro" | "en", { title: string; intro: string; note: string; cta: string; cards: Card[] }> = {
  ro: {
    title: "Despre mine",
    intro:
      "Bună, sunt Carmen, psiholog licențiat cu peste 15 ani de experiență. Sprijin persoanele care trec prin perioade dificile, se confruntă cu schimbări importante sau își doresc să se înțeleagă mai bine.",
    note: "Fiecare persoană este unică. De aceea, adaptez procesul terapeutic nevoilor, ritmului și obiectivelor tale.",
    cta: "Descoperă cum te pot ajuta",
    cards: [
      {
        title: "Experiență profesională și formare",
        body: (
          <>Am peste <B>15 ani de experiență profesională</B>, iar în 2026 am absolvit două programe de master: <B>Psihologie Educațională și Vocațională, cu media 10</B>, și <B>Psihologie Clinică, cu media 9,94</B>. În ambele cazuri, am obținut cea mai mare medie din promoție. Îmi actualizez constant pregătirea prin formare continuă.</>
        ),
        icon: "/despre/diploma.svg",
      },
      {
        title: "Experiență clinică în Londra",
        body: (
          <>Am acumulat <B>peste șapte ani de experiență clinică și educațională la Londra</B>, ca și specialist în suport comportamental la adolescenți, sprijin psihologic în oncologie, asistență persoanelor cu nevoi speciale și intervenții de suport educațional.</>
        ),
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Înțelegere și empatie biculturală",
        body: (
          <>Ca cetățean român și britanic, cu peste zece ani de viață și experiență profesională la Londra, <BookLink>ofer ședințe în limba română și engleză, atât la Cabinetul de Psihologie Carmen Foia din Oradea</BookLink>, cât și online. Înțeleg din proprie experiență provocările adaptării, ale apartenenței și ale vieții între două culturi.</>
        ),
        icon: "/despre/connected-people.svg",
      },
    ],
  },
  en: {
    title: "About me",
    intro:
      "Hi, I'm Carmen, a licensed psychologist with over 15 years of experience. I support people going through difficult times, facing major changes, or wanting to understand themselves better.",
    note: "Every person is unique. That's why I adapt the therapeutic process to your needs, pace, and goals.",
    cta: "Discover how I can help",
    cards: [
      {
        title: "Professional experience and training",
        body: (
          <>I have <B>over 15 years of professional experience</B>, and in 2026 I completed two master's programs: <B>Educational and Vocational Psychology, with a final grade of 10</B>, and <B>Clinical Psychology, with 9.94</B> — graduating top of my class in both. I keep my training up to date through continuous education.</>
        ),
        icon: "/despre/diploma.svg",
      },
      {
        title: "Clinical experience in London",
        body: (
          <>I gained <B>over seven years of clinical and educational experience in London</B> — as a specialist in behavioural support for adolescents, psychological support in oncology, care for people with special needs, and educational-support interventions.</>
        ),
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Bicultural understanding and empathy",
        body: (
          <>As a Romanian and British citizen, with over ten years of life and professional experience in London, <BookLink>I offer sessions in Romanian and English — both at the Carmen Foia Psychology Practice in Oradea</BookLink> and online. I understand from my own experience the challenges of adaptation, belonging, and living between two cultures.</>
        ),
        icon: "/despre/connected-people.svg",
      },
    ],
  },
};

/** "Despre mine" — white about-me section with three credential columns. Owns the #despre anchor. */
export function AboutMe() {
  const { language } = useLanguage();
  const t = copy[language];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const discoverMore = () => document.getElementById("servicii")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="despre" className="w-full bg-white px-6 py-20 md:px-[126px] md:py-[156px]">
      <div ref={ref} className="flex flex-col gap-12 md:gap-20">
        {/* Header row: intro (left) + note & CTA (right) */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 md:max-w-[660px] md:gap-5"
          >
            <h2 className="text-[#39342e]" style={{ ...FONT, fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.1 }}>
              {t.title}
            </h2>
            <p style={{ ...FONT, fontWeight: 400, fontSize: "clamp(18px,2vw,24px)", lineHeight: 1.5, color: MUTED }}>
              {t.intro}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex shrink-0 flex-col items-start gap-2.5 md:max-w-[420px] md:items-end"
          >
            <p className="text-left md:text-right" style={{ ...FONT, fontWeight: 400, fontSize: "16px", lineHeight: 1.5, color: "#39342e" }}>
              {t.note}
            </p>
            <button
              type="button"
              onClick={discoverMore}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#ffba68] px-6 py-3 text-base font-semibold tracking-[-0.3px] text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] md:hover:scale-105"
              style={FONT}
            >
              {t.cta}
            </button>
          </motion.div>
        </div>

        {/* Three credential columns */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-20">
          {t.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start gap-6 md:gap-8"
            >
              <img src={card.icon} alt="" aria-hidden className="size-[72px] md:size-[90px]" />
              <div className="flex flex-col gap-3">
                <h3 className="text-[#39342e]" style={{ ...FONT, fontWeight: 400, fontSize: "clamp(20px,2vw,24px)", lineHeight: 1.5 }}>
                  {card.title}
                </h3>
                <p style={{ ...FONT, fontWeight: 400, fontSize: "16px", lineHeight: 1.7, color: MUTED }}>
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
