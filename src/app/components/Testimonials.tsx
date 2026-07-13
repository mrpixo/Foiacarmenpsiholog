import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Star, X } from "lucide-react";
import { useLanguage } from "../i18n";
import { isSupabaseConfigured } from "../lib/supabase-config";
import type { Testimonial } from "../lib/community-format";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

function StarRow({ rating, size = 20 }: { rating: number; size?: number }) {
  // Default to a full 5 stars when no rating is set yet (e.g. rows created
  // before the rating column existed), so the stars always show the site yellow.
  const r = rating == null ? 5 : Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-1" aria-label={`${r}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= r ? "fill-[#ffba68] text-[#ffba68]" : "fill-transparent text-[rgba(57,52,46,0.25)]"}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { language } = useLanguage();
  const ro = language === "ro";
  const [items, setItems] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = prev (slide from left), 1 = next (slide from right)
  const [modalOpen, setModalOpen] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    import("../lib/community").then((m) => m.listPublishedTestimonials(5)).then(setItems).catch(() => {});
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (items.length ? (c + 1) % items.length : 0));
    }, 10000);
  };

  useEffect(() => {
    if (items.length === 0) return;
    setCurrent(0);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Pause auto-advance while the full-text modal is open.
  useEffect(() => {
    if (modalOpen) { if (timerRef.current) clearInterval(timerRef.current); }
    else if (items.length > 1) startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  // Detect whether the current quote is clamped to 3 lines (→ show "Read more").
  useEffect(() => {
    const measure = () => {
      const el = quoteRef.current;
      setTruncated(!!el && el.scrollHeight > el.clientHeight + 2);
    };
    const id = setTimeout(measure, 60); // after the entrance animation lays out
    window.addEventListener("resize", measure);
    return () => { clearTimeout(id); window.removeEventListener("resize", measure); };
  }, [current, items]);

  const go = (i: number, dir?: number) => {
    setDirection(dir ?? (i >= current ? 1 : -1));
    setCurrent(i);
    startTimer();
  };
  const next = () => go((current + 1) % items.length, 1);
  const prev = () => go((current - 1 + items.length) % items.length, -1);

  if (items.length === 0) return null;
  const t = items[current];

  // Slide direction follows navigation: next → the new card enters from the
  // right and the old one exits left; prev → mirrored. `custom={direction}`
  // re-evaluates the exit variant so the outgoing card leaves the right way.
  const slide = (dist: number): Variants => ({
    enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? dist : -dist }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -dist : dist }),
  });
  const cardVariants = slide(120);
  const headerVariants = slide(44);
  const quoteVariants = slide(76);

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-[126px]" style={{ background: "#f5eee9" }}>
      <div className="relative z-10 px-6 md:px-[164px] flex flex-col items-center gap-12 md:gap-24">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={t.id}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[1000px] flex cursor-grab flex-col gap-8 active:cursor-grabbing md:gap-12"
            drag={items.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
            }}
          >
            <motion.div
              className="flex items-center justify-between"
              custom={direction}
              variants={headerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, x: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className="flex flex-col gap-3">
                <p className="text-[rgba(57,52,46,0.7)]" style={{ ...FONT, fontWeight: 500, fontSize: "clamp(20px,2.4vw,32px)", lineHeight: 1.5 }}>
                  {t.name}
                </p>
                <StarRow rating={t.rating} />
              </div>
              <p className="text-[rgba(57,52,46,0.5)]" style={{ ...FONT, fontWeight: 400, fontSize: "16px", lineHeight: 1.5 }}>
                {current + 1}/{items.length}
              </p>
            </motion.div>

            <motion.div
              custom={direction}
              variants={quoteVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }, x: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }}
            >
              <p
                ref={quoteRef}
                className="line-clamp-3 text-[#39342e]"
                style={{ ...FONT, fontWeight: 500, fontSize: "clamp(22px,2.8vw,40px)", lineHeight: 1.5 }}
              >
                {t.quote}
              </p>
              {truncated && (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-4 inline-flex cursor-pointer items-center text-base font-semibold text-[#006960] underline underline-offset-4 transition-colors hover:text-[#054943]"
                  style={FONT}
                >
                  {ro ? "Citește mai mult" : "Read more"}
                </button>
              )}
            </motion.div>
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

      {/* Full-text modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalOpen(false)}
          >
            <div className="absolute inset-0 bg-[rgba(33,30,27,0.55)]" />
            <motion.div
              className="relative z-10 w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-3xl bg-[#faf6f2] p-7 md:p-9"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={FONT}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label={ro ? "Închide" : "Close"}
                className="absolute right-4 top-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#5c554d] transition-colors hover:bg-black/5 hover:text-[#39342e]"
              >
                <X size={20} />
              </button>
              <div className="mb-4 flex flex-col gap-3 pr-8">
                <p className="text-[#39342e]" style={{ fontWeight: 600, fontSize: "20px" }}>{t.name}</p>
                <StarRow rating={t.rating} size={18} />
              </div>
              <p className="whitespace-pre-line text-[#39342e]" style={{ fontWeight: 400, fontSize: "18px", lineHeight: 1.6 }}>
                {t.quote}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
