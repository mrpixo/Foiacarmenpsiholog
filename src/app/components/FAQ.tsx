import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";

const faqsRo = [
  { q: "Cum te pot ajuta?", a: "Ofer consiliere personalizată pentru gestionarea stresului, anxietății și dezvoltare personală, adaptată nevoilor tale." },
  { q: "Cum aveți grijă de confidențialitate?", a: "Toate sesiunile sunt complet confidențiale, conform eticii profesionale și legislației GDPR în vigoare." },
  { q: "Ce tipuri de terapie ofer?", a: "Ofer consiliere personalizată pentru gestionarea stresului, anxietății și dezvoltare personală, adaptată fiecărui client în parte." },
  { q: "Ce servicii oferiți pentru a vă diferenția de concurență?", a: "Ofer o abordare integrativă, adaptată fiecărui client, cu sesiuni individuale și de grup." },
  { q: "Care este abordarea dumneavoastră în gestionarea proiectelor?", a: "Abordez fiecare caz cu empatie și respect, construind o relație terapeutică solidă și de lungă durată." },
  { q: "Cum asigurați comunicarea eficientă cu clienții?", a: "Comunicăm prin WhatsApp, email și sesiuni regulate, asigurând transparență și disponibilitate continuă." },
];

const faqsEn = [
  { q: "How can you help me?", a: "I offer personalized counselling for stress, anxiety, performance, and personal development, adapted to your needs." },
  { q: "How is confidentiality protected?", a: "All sessions are fully confidential and follow professional ethics and applicable GDPR requirements." },
  { q: "What types of therapy do you offer?", a: "I offer individual therapy, personal development support, vocational guidance, and performance-focused counselling." },
  { q: "What makes your approach different?", a: "My work is integrative, warm, and adapted to each person, with attention to clarity and emotional safety." },
  { q: "What is your approach to therapy?", a: "Each process is built with empathy, respect, and a steady therapeutic relationship." },
  { q: "How do you communicate with clients?", a: "Communication is clear and practical, with scheduling and follow-up handled through agreed channels." },
];

function FaqItem({ item, index, isOpen, onToggle }: {
  item: typeof faqsRo[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <article
      className={[
        "overflow-hidden rounded-3xl transition-[background-color,box-shadow] duration-300",
        isOpen
          ? "bg-[#006960] shadow-[0_22px_70px_rgba(0,105,96,0.18)]"
          : "bg-[#fbf9f8] shadow-none hover:bg-[#f7f0eb]",
      ].join(" ")}
    >
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={[
            "group flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left outline-none transition-colors duration-300 md:px-8 md:py-6",
            "focus-visible:ring-2 focus-visible:ring-[#d9b46f] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            isOpen ? "text-white" : "text-[#39342e]",
          ].join(" ")}
        >
          <span
            className="flex-1 font-['Oakes_Grotesk'] font-medium leading-snug transition-colors duration-300"
            style={{ fontSize: "clamp(16px,1.5vw,22px)" }}
          >
            {item.q}
          </span>

          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={[
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "rotate-45" : "rotate-0",
              ].join(" ")}
            >
              <path
                d="M10 3V17M3 10H17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={[
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={[
              "px-6 pb-6 pr-14 font-['Oakes_Grotesk'] leading-relaxed transition-colors duration-300 md:px-8 md:pb-8 md:pr-20",
              isOpen ? "text-white/82" : "text-[#39342e]/70",
            ].join(" ")}
            style={{ fontSize: "clamp(14px,1.3vw,17px)" }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </article>
  );
}

export function FAQ() {
  const { language } = useLanguage();
  const faqs = language === "ro" ? faqsRo : faqsEn;
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full bg-white py-24 md:py-[156px]" id="faq">
      <div className="px-8 md:px-[126px] flex flex-col md:flex-row gap-16 items-start">
        {/* Left: text */}
        <div ref={ref} className="shrink-0 w-full md:w-[465px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#39342e]"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.1 }}
          >
            {language === "ro" ? "Întrebări frecvente" : "Frequently asked questions"}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[rgba(29,41,61,0.7)] mt-8"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(16px,1.4vw,22px)", lineHeight: 1.5 }}
          >
            {language === "ro" ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect." : "Every person is unique, and therapy is adapted to your specific needs and goals in a space based on empathy and respect."}
          </motion.p>
        </div>

        {/* Right: accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col gap-3 w-full"
        >
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              item={faq}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx((current) => (current === i ? -1 : i))}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
