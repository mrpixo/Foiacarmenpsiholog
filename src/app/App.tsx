import { useEffect, useRef, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HeroTop, HeroPhoto } from "./components/Hero";
import { TopBar } from "./components/TopBar";
import { AboutMe } from "./components/AboutMe";
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
import { CookieBanner } from "./components/CookieBanner";

// Non-homepage routes are code-split so the landing page doesn't ship the
// Cal.com booking embed, the TipTap-based news/admin surfaces, etc.
const Contact = lazy(() => import("./components/Contact").then((m) => ({ default: m.Contact })));
const BlogList = lazy(() => import("./components/blog/BlogList").then((m) => ({ default: m.BlogList })));
const BlogArticle = lazy(() => import("./components/blog/BlogArticle").then((m) => ({ default: m.BlogArticle })));
const NewsList = lazy(() => import("./components/news/NewsList").then((m) => ({ default: m.NewsList })));
const NewsDetail = lazy(() => import("./components/news/NewsDetail").then((m) => ({ default: m.NewsDetail })));
const FaqPage = lazy(() => import("./components/faq/FaqPage").then((m) => ({ default: m.FaqPage })));
const PrivacyPolicy = lazy(() => import("./components/legal/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfUse = lazy(() => import("./components/legal/TermsOfUse").then((m) => ({ default: m.TermsOfUse })));
const AdminGate = lazy(() => import("./components/admin/AdminGate").then((m) => ({ default: m.AdminGate })));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminEditor = lazy(() => import("./components/admin/AdminEditor").then((m) => ({ default: m.AdminEditor })));
const AdminNewsDashboard = lazy(() => import("./components/admin/AdminNewsDashboard").then((m) => ({ default: m.AdminNewsDashboard })));
const AdminNewsEditor = lazy(() => import("./components/admin/AdminNewsEditor").then((m) => ({ default: m.AdminNewsEditor })));
const AdminTestimonials = lazy(() => import("./components/admin/AdminTestimonials").then((m) => ({ default: m.AdminTestimonials })));
const AdminFaq = lazy(() => import("./components/admin/AdminFaq").then((m) => ({ default: m.AdminFaq })));
const AdminPromoCodes = lazy(() => import("./components/admin/AdminPromoCodes").then((m) => ({ default: m.AdminPromoCodes })));
import { LanguageProvider } from "./i18n";
import { AuthProvider } from "./lib/auth";
import { ConsentProvider } from "./lib/consent";
import { useSeo } from "./lib/seo";

function FullWidthPhoto() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(300px,40vw,700px)" }}>
      <img
        src="/hero-office-1280.webp"
        srcSet="/hero-office-768.webp 768w, /hero-office-1280.webp 1280w, /hero-office-1728.webp 1728w"
        sizes="100vw"
        alt=""
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        aria-hidden
        loading="lazy"
        decoding="async"
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

      {/* 3b. About me — credentials (owns the #despre anchor) */}
      <AboutMe />

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

      <Suspense fallback={<div className="min-h-screen" aria-hidden />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        {/* Pretty, shareable deep-links to a session type (see Contact card share button) */}
        <Route path="/programare/:reason" element={<Contact />} />
        <Route path="/programare/:reason/:mode" element={<Contact />} />
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
        <Route path="/admin/promo" element={<AdminGate><AdminPromoCodes /></AdminGate>} />
      </Routes>
      </Suspense>

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
