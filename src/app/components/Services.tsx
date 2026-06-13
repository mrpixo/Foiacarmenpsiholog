import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import imgRect16 from "../../imports/Body/73056bd19e50c0720161c9b18d983fc7721ddf7a.webp";
import imgRect17 from "../../imports/Body/49859db54fbf9aeb6aea41ad98bcc853a0a36328.webp";
import imgRect19 from "../../imports/Body/1bfa4bbb6a33afca33b5187e6c60ca7c54685315.webp";
import imgRect20 from "../../imports/Body/8fda238a3766c34f1aa3d3b52bab3293794ab0d4.webp";
import imgAnxietate from "../../imports/Body/anxietate-performanta.webp";
import { useLanguage } from "../i18n";

const services = {
  ro: [
    { id: 0, reason: "psihologie-sportiva", title: "Psihologie sportivă", description: "Dezvoltarea concentrării, încrederii și performanței în sport.", image: imgRect16 },
    { id: 1, reason: "orientare-vocationala", title: "Orientare vocațională", description: "Claritate în alegerea carierei și a direcției profesionale.", image: imgRect17 },
    { id: 2, reason: "anxietate-performanta", title: "Anxietate de performanță", description: "Gestionarea emoțiilor și a presiunii în situații importante.", image: imgAnxietate },
    { id: 3, reason: "terapie-individuala", title: "Terapie individuală", description: "Sprijin pentru dificultăți emoționale și provocări personale.", image: imgRect20 },
    { id: 4, reason: "terapie-cuplu", title: "Terapie de cuplu", description: "Îmbunătățirea comunicării și consolidarea relației.", image: imgRect19 },
    { id: 5, reason: "dezvoltare-personala", title: "Dezvoltare personală", description: "Creșterea încrederii, autocunoaștere și atingerea potențialului personal.", image: imgRect16 },
  ],
  en: [
    { id: 0, reason: "psihologie-sportiva", title: "Sports psychology", description: "Building focus, confidence, and performance in sport.", image: imgRect16 },
    { id: 1, reason: "orientare-vocationala", title: "Vocational guidance", description: "Clarity in choosing your career and professional direction.", image: imgRect17 },
    { id: 2, reason: "anxietate-performanta", title: "Performance anxiety", description: "Managing emotions and pressure in important moments.", image: imgAnxietate },
    { id: 3, reason: "terapie-individuala", title: "Individual therapy", description: "Support for emotional difficulties and personal challenges.", image: imgRect20 },
    { id: 4, reason: "terapie-cuplu", title: "Couples therapy", description: "Improving communication and strengthening your relationship.", image: imgRect19 },
    { id: 5, reason: "dezvoltare-personala", title: "Personal development", description: "Building confidence, self-awareness, and reaching your potential.", image: imgRect16 },
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
      className="group relative cursor-pointer overflow-hidden"
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

      {/* MOBILE layout — image (16:9, full width) → title → body → full-width CTA */}
      <div className="relative z-10 flex flex-col gap-5 px-6 py-8 md:hidden">
        <img
          src={service.image}
          alt={service.title}
          className="aspect-video w-full rounded-2xl object-cover"
        />
        <p style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 700, fontSize: "22px", lineHeight: 1.3, color: "#39342e" }}>
          {service.title}
        </p>
        <p style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontSize: "16px", lineHeight: 1.5, color: "#45556c" }}>
          {service.description}
        </p>
        <Link
          to={`/contact?reason=${service.reason}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#ffba68] px-6 py-3.5 text-base font-semibold text-[#1f1d1a] transition-colors duration-300 hover:bg-[#ffc985]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
        >
          {language === "ro" ? "Programează-te acum" : "Book a session"}
        </Link>
      </div>

      {/* DESKTOP layout — title + description + hover image/CTA swap */}
      <div className="relative z-10 hidden md:flex px-[126px] py-10 flex-row items-center gap-10 overflow-visible">
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

        {/* Image/CTA slot — image by default, button on hover (cross-fade). */}
        <div className="relative shrink-0 size-[200px] flex items-center justify-center">
          <img
            src={service.image}
            alt={service.title}
            className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          <Link
            to={`/contact?reason=${service.reason}`}
            className="relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#ffba68] px-6 py-3 text-sm font-semibold text-[#1f1d1a] opacity-0 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-[#ffc985]"
            style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" }}
          >
            {language === "ro" ? "Programează-te acum" : "Book a session"}
          </Link>
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
    <section className="w-full bg-white py-16 md:py-[156px]" id="servicii">
      {/* Header */}
      <div ref={ref} className="px-6 md:px-[126px] mb-12 md:mb-16">
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
          className="text-[rgba(29,41,61,0.7)] mt-5 max-w-[660px] [text-wrap:balance]"
          style={{ fontFamily: "'Oakes Grotesk', 'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(16px,1.6vw,24px)", lineHeight: 1.5 }}
        >
          {language === "ro" ? "Sprijin adaptat nevoilor tale, indiferent de etapa în care te afli." : "Support tailored to your needs, whatever stage you're at."}
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
