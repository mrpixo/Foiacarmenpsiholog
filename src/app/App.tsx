import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Contact } from "./components/Contact";
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
import { BlogList } from "./components/blog/BlogList";
import { BlogArticle } from "./components/blog/BlogArticle";
import { AdminGate } from "./components/admin/AdminGate";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminEditor } from "./components/admin/AdminEditor";
import { AdminNewsDashboard } from "./components/admin/AdminNewsDashboard";
import { AdminNewsEditor } from "./components/admin/AdminNewsEditor";
import { NewsList } from "./components/news/NewsList";
import { NewsDetail } from "./components/news/NewsDetail";
import { FaqPage } from "./components/faq/FaqPage";
import { AdminTestimonials } from "./components/admin/AdminTestimonials";
import { AdminFaq } from "./components/admin/AdminFaq";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { TermsOfUse } from "./components/legal/TermsOfUse";
import { CookieBanner } from "./components/CookieBanner";
import { LanguageProvider } from "./i18n";
import { AuthProvider } from "./lib/auth";
import { ConsentProvider } from "./lib/consent";
import { useSeo } from "./lib/seo";
import imgHeroBg from "../imports/Body/019dd9eeb6b49b7cdb6f1dd68088dd908e2ec026.webp";

function FullWidthPhoto() {
  return (
    <div id="despre" className="relative w-full overflow-hidden" style={{ height: "clamp(300px,40vw,700px)" }}>
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

function Home() {
  useSeo({
    title: { ro: "Psiholog Oradea — Terapie & Consiliere", en: "Psychologist in Oradea — Therapy & Counselling" },
    description: {
      ro: "Carmen Foia, psiholog clinician în Oradea. Terapie individuală și de cuplu, consiliere, psihologie sportivă și dezvoltare personală. Programează o ședință.",
      en: "Carmen Foia, clinical psychologist in Oradea. Individual and couples therapy, counselling, sports psychology and personal development. Book a session.",
    },
    path: "/",
  });
  return (
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
  );
}

/** Reset scroll position on route change. */
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function AppShell() {
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

  // The admin CMS is a separate surface — no marketing navbar/footer/spotlight.
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
      <div className="relative min-h-screen w-full" style={{ background: "#f5eee9" }}>
      <ScrollToTopOnNavigate />

      {!isAdmin && (
        <>
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
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/noutati" element={<NewsList />} />
        <Route path="/noutati/:slug" element={<NewsDetail />} />
        <Route path="/intrebari-frecvente" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
        <Route path="/admin/new" element={<AdminGate><AdminEditor /></AdminGate>} />
        <Route path="/admin/edit/:id" element={<AdminGate><AdminEditor /></AdminGate>} />
        <Route path="/admin/news" element={<AdminGate><AdminNewsDashboard /></AdminGate>} />
        <Route path="/admin/news/new" element={<AdminGate><AdminNewsEditor /></AdminGate>} />
        <Route path="/admin/news/edit/:id" element={<AdminGate><AdminNewsEditor /></AdminGate>} />
        <Route path="/admin/testimonials" element={<AdminGate><AdminTestimonials /></AdminGate>} />
        <Route path="/admin/faq" element={<AdminGate><AdminFaq /></AdminGate>} />
      </Routes>

      {!isAdmin && (
        <>
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
        </>
      )}

      {/* GDPR cookie consent — shown site-wide */}
      <CookieBanner />
      </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ConsentProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </ConsentProvider>
    </LanguageProvider>
  );
}
