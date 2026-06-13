import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { isSupabaseConfigured } from "../lib/supabase";
import { listPublishedTestimonials, type Testimonial } from "../lib/community";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listPublishedTestimonials(5).then(setItems).catch(() => {});
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (items.length ? (c + 1) % items.length : 0)), 10000);
  };

  useEffect(() => {
    if (items.length === 0) return;
    setCurrent(0);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const go = (i: number) => { setCurrent(i); startTimer(); };

  if (items.length === 0) return null;
  const t = items[current];

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-[126px]" style={{ background: "#f5eee9" }}>
      <div className="relative z-10 px-6 md:px-[164px] flex flex-col items-center gap-12 md:gap-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[1000px] flex flex-col gap-14"
          >
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: 44 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -44 }}
              transition={{ opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, x: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
            >
              <p className="text-[rgba(57,52,46,0.7)]" style={{ ...FONT, fontWeight: 500, fontSize: "clamp(20px,2.4vw,32px)", lineHeight: 1.5 }}>
                {t.name}
              </p>
              <p className="text-[rgba(57,52,46,0.5)]" style={{ ...FONT, fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}>
                {current + 1}/{items.length}
              </p>
            </motion.div>

            <motion.p
              className="text-[#39342e]"
              initial={{ opacity: 0, x: 76 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -76 }}
              transition={{ opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }, x: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }}
              style={{ ...FONT, fontWeight: 500, fontSize: "clamp(22px,2.8vw,40px)", lineHeight: 1.5 }}
            >
              {t.quote}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="rounded-full transition-all duration-400 overflow-hidden"
                style={{ width: i === current ? 56 : 12, height: 12, background: i === current ? "#006960" : "transparent", border: i === current ? "none" : "2px solid rgba(57,52,46,0.5)" }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
