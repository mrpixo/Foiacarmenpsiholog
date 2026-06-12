import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useLanguage } from "../i18n";
import { isSupabaseConfigured } from "../lib/supabase";
import { listHomepageFaq, faqQuestion, faqAnswer, type Faq } from "../lib/community";
import { FaqItem } from "./faq/FaqItem";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

export function FAQ() {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openIdx, setOpenIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listHomepageFaq(6).then(setFaqs).catch(() => {});
  }, []);

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
            style={{ ...FONT, fontWeight: 700, fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.1 }}
          >
            {language === "ro" ? "Întrebări frecvente" : "Frequently asked questions"}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[rgba(29,41,61,0.7)] mt-8"
            style={{ ...FONT, fontWeight: 400, fontSize: "clamp(16px,1.4vw,22px)", lineHeight: 1.5 }}
          >
            {language === "ro"
              ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect."
              : "Every person is unique, and therapy is adapted to your specific needs and goals in a space based on empathy and respect."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}>
            <Link
              to="/intrebari-frecvente"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985] hover:scale-105"
              style={FONT}
            >
              {language === "ro" ? "Vezi toate întrebările" : "See all questions"}
            </Link>
          </motion.div>
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
              key={faq.id}
              question={faqQuestion(faq, language)}
              answer={faqAnswer(faq, language)}
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
