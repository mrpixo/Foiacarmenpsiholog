import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import imgRect16 from "../../imports/Body/73056bd19e50c0720161c9b18d983fc7721ddf7a.png";
import imgRect17 from "../../imports/Body/49859db54fbf9aeb6aea41ad98bcc853a0a36328.png";
import imgRect18 from "../../imports/Body/c5ec97bda42d210a1e3d698f4949c7b911ec514d.png";
import imgRect19 from "../../imports/Body/1bfa4bbb6a33afca33b5187e6c60ca7c54685315.png";
import imgRect20 from "../../imports/Body/8fda238a3766c34f1aa3d3b52bab3293794ab0d4.png";
import { useLanguage } from "../i18n";

const services = {
  ro: [
    { id: 0, title: "Psihologie sportivă", description: "Sesiuni 1-la-1 personalizate pentru a te ajuta să depășești anxietatea.", image: imgRect16 },
    { id: 1, title: "Orientare vocațională", description: "Consiliere pentru claritate profesională și decizii asumate.", image: imgRect17 },
    { id: 2, title: "Anxietate de performanță", description: "Strategii pentru reglare emoțională, focus și încredere.", image: imgRect18 },
    { id: 3, title: "Terapie individuală", description: "Sesiuni personalizate pentru autocunoaștere și echilibru.", image: imgRect19 },
    { id: 4, title: "Terapie de cuplu", description: "Sprijin pentru comunicare, reconectare și înțelegere reciprocă.", image: imgRect20 },
    { id: 5, title: "Dezvoltare personală", description: "Programe de autocunoaștere pentru a-ți atinge potențialul maxim.", image: imgRect16 },
  ],
  en: [
    { id: 0, title: "Sports psychology", description: "Personalized one-to-one sessions to help you manage pressure and anxiety.", image: imgRect16 },
    { id: 1, title: "Vocational guidance", description: "Counselling for career clarity and confident decision-making.", image: imgRect17 },
    { id: 2, title: "Performance anxiety", description: "Tools for emotional regulation, focus, and self-trust.", image: imgRect18 },
    { id: 3, title: "Individual therapy", description: "Tailored sessions for self-awareness, healing, and balance.", image: imgRect19 },
    { id: 4, title: "Couples therapy", description: "Support for communication, reconnection, and mutual understanding.", image: imgRect20 },
    { id: 5, title: "Personal development", description: "Self-discovery programs designed to help you reach your potential.", image: imgRect16 },
  ],
};

function ServiceRow({ service, index }: {
  service: typeof services.ro[0];
  index: number;
}) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-pointer overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated background fill */}
      <motion.div
        className="absolute inset-0 bg-[#006960] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 px-8 md:px-[126px] py-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10 overflow-visible">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#006960]"
          initial={false}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
        />

        {/* Title */}
        <motion.p
          animate={{ color: hovered ? "#ffffff" : "#39342e" }}
          transition={{ duration: 0.3 }}
          className="shrink-0 md:w-[470px]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(20px,2.4vw,32px)", lineHeight: "32px" }}
        >
          {service.title}
        </motion.p>

        {/* Description */}
        <motion.p
          animate={{ color: hovered ? "rgba(255,255,255,0.8)" : "#45556c" }}
          transition={{ duration: 0.3 }}
          className="flex-1"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontSize: "clamp(14px,1.4vw,20px)", lineHeight: 1.5 }}
        >
          {service.description}
        </motion.p>

        {/* Image/CTA slot — image hides on hover, button replaces it */}
        <div className="relative shrink-0 size-[140px] md:size-[200px] overflow-visible flex items-center justify-center">
          <motion.img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover overflow-hidden rounded-2xl"
            animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.96 : 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          <AnimatePresence>
            {hovered && (
              <motion.a
                href="#contact"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 inline-flex items-center justify-center bg-[#ffba68] text-[#1f1d1a] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300 hover:bg-[#ffc985] hover:scale-105 whitespace-nowrap"
                style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
              >
                {language === "ro" ? "Programează-te acum" : "Book a session"}
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { language } = useLanguage();
  const currentServices = services[language];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full bg-white py-24 md:py-[156px]" id="servicii">
      {/* Header */}
      <div ref={ref} className="px-8 md:px-[126px] mb-12 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[#39342e] text-left"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.5 }}
        >
          {language === "ro" ? "Domeniile de activitate" : "Areas of practice"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[rgba(29,41,61,0.7)] mt-5 max-w-[660px]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(16px,1.6vw,24px)", lineHeight: 1.5 }}
        >
          {language === "ro" ? "Fiecare persoană este unică, iar abordarea terapeutică este adaptată nevoilor și obiectivelor tale specifice, într-un mediu bazat pe empatie și respect." : "Explore the main areas where I can support you, with an approach tailored to each person."}
        </motion.p>
      </div>

      {/* Service rows */}
      <div className="flex flex-col divide-y divide-[#d9d9d9]">
        {currentServices.map((service, i) => (
          <ServiceRow key={service.id} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
