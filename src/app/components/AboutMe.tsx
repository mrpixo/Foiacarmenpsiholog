import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
// Muted body colour from the Figma "Despre mine" design.
const MUTED = "rgba(29,41,61,0.7)";

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
      "Bună, sunt Carmen, psiholog licențiat de peste 15 ani, cu o experiență profesională solidă în sănătate mintală în Londra și România. Sunt Psiholog Clinician și Psiholog Educațional, consiliere școlară și vocațională, membră acreditată de Colegiul Psihologilor din România.",
    note: "Fiecare persoană este unică. De aceea, adaptez procesul terapeutic nevoilor, ritmului și obiectivelor tale.",
    cta: "Descoperă cum te pot ajuta",
    cards: [
      {
        title: "Experiență profesională și formare",
        body: (
          <>Sunt psiholog licențiat de peste 15 ani. Am absolvit două programe de master, Psihologie Clinică și Psihologie Educațională, Consiliere Școlară și Vocațională, cu bursă de merit pe toată durata studiilor. Particip constant la programe de specializare și sunt membru al Asociației Psihologilor din Marea Britanie și al Colegiului Psihologilor din România.</>
        ),
        icon: "/despre/diploma.svg",
      },
      {
        title: "Experiență clinică în Londra",
        body: (
          <>Am experiență de peste 7 ani în sănătate mentală în Londra, unde am lucrat cu copii, adolescenți și adulți în școli, clinici și servicii de suport. Experiența mea include lucrul cu persoane cu nevoi speciale, dificultăți emoționale și comportamentale, precum și cu pacienți oncologici și persoane care se confruntă cu afecțiuni neuropsihiatrice și deteriorare cognitivă.</>
        ),
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Înțelegere și empatie biculturală",
        body: (
          <>Sunt cetățean britanic și român și am locuit mai mult de 10 ani în Londra. Experiența de viață și profesională în ambele culturi îmi permite să înțeleg mai bine nevoile persoanelor din medii diferite. <BookLink>Ofer servicii psihologice în română și engleză, atât în cabinetul de psihologie Oradea, cât și online</BookLink>, oriunde în lume.</>
        ),
        icon: "/despre/connected-people.svg",
      },
    ],
  },
  en: {
    title: "About me",
    intro:
      "Hi, I'm Carmen, a licensed psychologist for over 15 years, with solid professional experience in mental health in London and Romania. I'm a clinical psychologist and educational psychologist — school and vocational counselling — and an accredited member of the Romanian College of Psychologists.",
    note: "Every person is unique. That's why I adapt the therapeutic process to your needs, pace, and goals.",
    cta: "Discover how I can help",
    cards: [
      {
        title: "Professional experience and training",
        body: (
          <>I'm a licensed psychologist with over 15 years of experience. I completed two master's programs — Clinical Psychology, and Educational Psychology, School and Vocational Counselling — with a merit scholarship throughout my studies. I regularly take part in specialization programs and am a member of the Association of Psychologists in Great Britain and the Romanian College of Psychologists.</>
        ),
        icon: "/despre/diploma.svg",
      },
      {
        title: "Clinical experience in London",
        body: (
          <>I have over 7 years of experience in mental health in London, where I worked with children, adolescents, and adults across schools, clinics, and support services. My experience includes working with people with special needs, emotional and behavioural difficulties, as well as oncology patients and people facing neuropsychiatric conditions and cognitive decline.</>
        ),
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Bicultural understanding and empathy",
        body: (
          <>I'm a British and Romanian citizen and lived in London for over 10 years. Life and professional experience in both cultures helps me better understand the needs of people from different backgrounds. <BookLink>I offer psychological services in Romanian and English, both at the psychology practice in Oradea and online</BookLink>, anywhere in the world.</>
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
