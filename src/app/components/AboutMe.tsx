import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
// Muted body colour from the Figma "Despre mine" design.
const MUTED = "rgba(29,41,61,0.7)";

type Card = { title: string; body: string; icon: string };

const copy: Record<"ro" | "en", { title: string; intro: string; note: string; cta: string; cards: Card[] }> = {
  ro: {
    title: "Despre mine",
    intro:
      "Bună, sunt Carmen, psiholog cu peste 15 ani de experiență. Sprijin persoanele care trec prin perioade dificile, se confruntă cu schimbări importante sau își doresc să se înțeleagă mai bine.",
    note: "Fiecare persoană este unică. De aceea, adaptez procesul terapeutic nevoilor, ritmului și obiectivelor tale.",
    cta: "Descoperă mai multe",
    cards: [
      {
        title: "Experiență și formare profesională",
        body: "Am peste 15 ani de experiență profesională și două programe de master în Psihologie Clinică, respectiv Psihologie Educațională și Vocațională. Îmi actualizez constant pregătirea prin formare continuă.",
        icon: "/despre/diploma.svg",
      },
      {
        title: "Experiență clinică în Londra",
        body: "Am acumulat peste șapte ani de experiență clinică la Londra, lucrând în arii precum evaluarea comportamentală, suportul psihologic în oncologie și sprijinirea persoanelor cu nevoi speciale.",
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Înțelegere biculturală",
        body: "Ca cetățean român și britanic, cu peste zece ani petrecuți la Londra, ofer ședințe în română și engleză. Înțeleg din interior provocările adaptării, apartenenței și vieții între două culturi.",
        icon: "/despre/connected-people.svg",
      },
    ],
  },
  en: {
    title: "About me",
    intro:
      "Hi, I'm Carmen, a psychologist with over 15 years of experience. I support people going through difficult times, facing major changes, or wanting to understand themselves better.",
    note: "Every person is unique. That's why I adapt the therapeutic process to your needs, pace, and goals.",
    cta: "Discover more",
    cards: [
      {
        title: "Experience and professional training",
        body: "I have over 15 years of professional experience and two master's programs — in Clinical Psychology and in Educational and Vocational Psychology. I keep my training up to date through continuous education.",
        icon: "/despre/diploma.svg",
      },
      {
        title: "Clinical experience in London",
        body: "I gained over seven years of clinical experience in London, working in areas such as behavioural assessment, psychological support in oncology, and supporting people with special needs.",
        icon: "/despre/big-ben.svg",
      },
      {
        title: "Bicultural understanding",
        body: "As a Romanian and British citizen, with over ten years spent in London, I offer sessions in Romanian and English. I understand from the inside the challenges of adaptation, belonging, and living between two cultures.",
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
              <h3 className="text-[#39342e]" style={{ ...FONT, fontWeight: 400, fontSize: "clamp(20px,2vw,24px)", lineHeight: 1.5 }}>
                {card.title}
              </h3>
              <p style={{ ...FONT, fontWeight: 400, fontSize: "16px", lineHeight: 1.5, color: MUTED }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
