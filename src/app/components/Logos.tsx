import { useRef } from "react";
import { motion, useInView } from "motion/react";
// Company logos as text
const logoLabels = [
  "Barclays", "McKinsey", "Deloitte", "Accenture", "Goldman Sachs",
  "PWC", "KPMG", "EY", "Vodafone", "Orange", "BCR", "BRD",
  "Raiffeisen", "ING", "UniCredit",
];

export function Logos() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const doubled = [...logoLabels, ...logoLabels];

  return (
    <section className="w-full overflow-hidden py-20" style={{ background: "#f5eee9" }}>
      <div ref={ref} className="px-8 md:px-[128px] mb-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-[#39342e]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,64px)", lineHeight: 1.5 }}
        >
          Experienta cu
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative mt-4">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f5eee9, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f5eee9, transparent)" }} />

        <motion.div
          className="flex gap-0 will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {doubled.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-8 py-5 border-r border-[#d0c8be] shrink-0 min-w-[120px]"
            >
              <span
                className="text-[#39342e]/55 font-semibold whitespace-nowrap text-sm md:text-base hover:text-[#39342e] transition-colors duration-200"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
