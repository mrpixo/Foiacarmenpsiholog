import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HeroTop, HeroPhoto } from "./components/Hero";
import { TopBar } from "./components/TopBar";
import { Intro } from "./components/Intro";
import { Mission } from "./components/Mission";
import { Services } from "./components/Services";
import { Logos } from "./components/Logos";
import { News } from "./components/News";
import { SocialCTA } from "./components/SocialCTA";
import { Testimonials } from "./components/Testimonials";
import { Articles } from "./components/Articles";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "./i18n";
import imgHeroBg from "../imports/Body/019dd9eeb6b49b7cdb6f1dd68088dd908e2ec026.png";

function FullWidthPhoto() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(300px,40vw,700px)" }}>
      <img
        src={imgHeroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[rgba(33,30,27,0.15)]" />
    </div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
      el.style.opacity = "1";
    };
    const handleMouseLeave = () => { el.style.opacity = "0"; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen w-full" style={{ background: "#f5eee9" }}>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#006960] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(0,105,96,0.04), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating navbar */}
      <Navbar />

      <main>
        {/* 1. Beige section with service categories */}
        <HeroTop />

        {/* 2. Full-width hero photo with portrait */}
        <HeroPhoto />

        {/* 3. Top bar — WhatsApp + social (below hero) */}
        <TopBar />

        {/* 4. Green intro statement */}
        <Intro />

        {/* 5. Beige mission section */}
        <Mission />

        {/* 6. White services list */}
        <Services />

        {/* 7. Beige logos marquee */}
        <Logos />

        {/* 8. Green news section */}
        <News />

        {/* 9. Dark social CTA */}
        <SocialCTA />

        {/* 10. Beige testimonials */}
        <Testimonials />

        {/* 11. White blog articles */}
        <Articles />

        {/* 12. Full-width photo */}
        <FullWidthPhoto />

        {/* 13. White FAQ */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to top */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 size-11 bg-[#006960] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,105,96,0.3)] hover:bg-[#054943] transition-all duration-300 hover:-translate-y-0.5"
        aria-label="Scroll to top"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
      </div>
    </LanguageProvider>
  );
}
