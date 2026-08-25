import { Link } from "react-router";
import imgPortrait from "../../imports/Body/carmen-portrait-new.webp";
import { useLanguage } from "../i18n";
import { useGoogleReviews, type GoogleReviews } from "../lib/googleReviews";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

const copy = {
  ro: {
    name: "Carmen Foia Psiholog",
    role: "Psiholog clinician, psiholog educațional, consiliere școlară și vocațională",
    where: "Online sau la cabinet",
    cta: "Programează o ședință",
    reviews: "recenzii",
    googleAria: "Recenzii Google",
  },
  en: {
    name: "Carmen Foia Psychologist",
    role: "Clinical psychologist, educational psychologist, school & vocational counselling",
    where: "Online or in person",
    cta: "Book a session",
    reviews: "reviews",
    googleAria: "Google reviews",
  },
};

const STAR_PATH = "M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01z";

function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (fill: string) =>
    [0, 1, 2, 3, 4].map((i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={fill} className="shrink-0">
        <path d={STAR_PATH} />
      </svg>
    ));
  return (
    <div className="relative inline-flex">
      <div className="flex gap-0.5">{row("#e3dbd1")}</div>
      <div className="absolute inset-0 flex gap-0.5 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("#ffba68")}
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.74z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.26a12 12 0 0 0 0 10.76z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function GoogleBadge({ reviews, label, reviewsWord }: { reviews: GoogleReviews; label: string; reviewsWord: string }) {
  const inner = (
    <>
      <div className="text-[28px] font-bold leading-none text-[#1f1d1b]" style={FONT}>
        {reviews.rating.toFixed(1)}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <GoogleG />
          <span className="text-[13px] font-semibold text-[#5c554d]" style={FONT}>Google</span>
        </div>
        <Stars rating={reviews.rating} />
        {reviews.total > 0 && (
          <span className="text-[11px] text-[#a89f95]" style={FONT}>
            {reviews.total} {reviewsWord}
          </span>
        )}
      </div>
    </>
  );
  const cls =
    "flex items-center gap-3 rounded-2xl border border-[#e7ded5] bg-white px-4 py-3 transition-colors";
  return reviews.url ? (
    <a href={reviews.url} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${cls} hover:border-[#006960]/40`}>
      {inner}
    </a>
  ) : (
    <div className={cls} aria-label={label}>{inner}</div>
  );
}

export function AuthorCard() {
  const { language } = useLanguage();
  const t = copy[language];
  const reviews = useGoogleReviews();

  return (
    <div className="rounded-3xl border border-[#e7ded5] bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,105,96,0.06)] sm:p-8">
      {/* Photo */}
      <div className="mx-auto size-[132px] overflow-hidden rounded-full bg-[#f5eee9] ring-4 ring-[#f5eee9]">
        <img
          src={imgPortrait}
          alt={t.name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Name + role */}
      <p className="mt-5 text-[18px] font-semibold text-[#39342e]" style={FONT}>{t.name}</p>
      <p className="mx-auto mt-2 max-w-[240px] text-[13px] leading-[1.5] text-[#62748e]" style={FONT}>{t.role}</p>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-[#e7ded5]" />

      {/* CTA, then availability below it */}
      <Link
        to="/contact"
        className="inline-flex w-full items-center justify-center rounded-full bg-[#ffba68] px-7 py-3.5 text-base font-semibold text-[#1f1d1b] transition-all duration-300 hover:bg-[#ffc985]"
        style={FONT}
      >
        {t.cta}
      </Link>
      <p className="mt-4 text-[15px] font-medium text-[#39342e]" style={FONT}>{t.where}</p>

      {/* Google rating — only when live data is available */}
      {reviews && (
        <div className="mt-6 flex justify-center">
          <GoogleBadge reviews={reviews} label={t.googleAria} reviewsWord={t.reviews} />
        </div>
      )}
    </div>
  );
}
