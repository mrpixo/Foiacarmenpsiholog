import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";

const testimonialsRo = [
  {
    id: 1,
    name: "Mariana V",
    index: "1/3",
    text: "După câteva ședințe, am început să înțeleg mai bine provocările mele și să găsesc soluții practice. Recomand cu încredere!",
  },
  {
    id: 2,
    name: "Alexandru M",
    index: "2/3",
    text: "Carmen m-a ajutat să înțeleg tiparele care mă țineau pe loc. Sesiunile au fost transformatoare — am câștigat claritate și încredere.",
  },
  {
    id: 3,
    name: "Ioana T",
    index: "3/3",
    text: "Un spațiu sigur unde am putut comunica sincer. Terapia mi-a schimbat perspectiva și relațiile din viața mea.",
  },
];

const testimonialsEn = [
  { id: 1, name: "Mariana V", index: "1/3", text: "After a few sessions, I began to understand my challenges more clearly and find practical solutions. Highly recommended!" },
  { id: 2, name: "Alexandru M", index: "2/3", text: "Carmen helped me understand the patterns that were keeping me stuck. The sessions brought clarity and confidence." },
  { id: 3, name: "Ioana T", index: "3/3", text: "A safe space where I could speak honestly. Therapy changed my perspective and my relationships." },
];

export function Testimonials() {
  const { language } = useLanguage();
  const testimonials = language === "ro" ? testimonialsRo : testimonialsEn;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 10000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const go = (i: number) => { setCurrent(i); startTimer(); };
  const t = testimonials[current];

  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-[126px]"
      style={{ background: "#f5eee9" }}
    >
      <div className="relative z-10 px-8 md:px-[164px] flex flex-col items-center gap-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[1000px] flex flex-col gap-14"
          >
            {/* Name + index */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: 44 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -44 }}
              transition={{
                opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0 },
                x: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0 },
              }}
            >
              <p
                className="text-[rgba(57,52,46,0.7)]"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 500, fontSize: "clamp(20px,2.4vw,32px)", lineHeight: 1.5 }}
              >
                {t.name}
              </p>
              <p
                className="text-[rgba(57,52,46,0.5)]"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}
              >
                {t.index}
              </p>
            </motion.div>

            {/* Quote */}
            <motion.p
              className="text-[#39342e]"
              initial={{ opacity: 0, x: 76 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -76 }}
              transition={{
                opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
                x: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
              }}
              style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 500, fontSize: "clamp(22px,2.8vw,40px)", lineHeight: 1.5 }}
            >
              {t.text}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-400 overflow-hidden"
              style={{
                width: i === current ? 56 : 12,
                height: 12,
                background: i === current ? "#006960" : "transparent",
                border: i === current ? "none" : "2px solid rgba(57,52,46,0.5)",
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
