/**
 * Circular country flags used by the language selector.
 * The UK flag geometry is taken from the Figma design (node 271:1401).
 */

type FlagProps = { className?: string };

export function FlagGB({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
      <mask id="flag-gb-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="44" height="44">
        <circle cx="23.998" cy="23.9985" r="21.9971" fill="#D9D9D9" />
      </mask>
      <g mask="url(#flag-gb-mask)">
        <path d="M-5.3332 2.00144H53.3257V45.9956H-5.3332V2.00144Z" fill="#012169" />
        <path d="M1.54089 2.00144L23.9046 18.5909L46.1767 2.00144H53.3257V7.68402L31.3286 24.0902L53.3257 40.4047V45.9956H45.9933L23.9963 29.5895L2.09082 45.9956H-5.3332V40.4964L16.5722 24.1818L-5.3332 7.86733V2.00144H1.54089Z" fill="white" />
        <path d="M33.5283 27.7564L53.3257 42.3294V45.9956L28.4873 27.7564H33.5283ZM16.6639 29.5895L17.2138 32.7974L-0.383854 45.9956H-5.3332L16.6639 29.5895ZM53.3257 2.00144V2.27641L30.5037 19.5075L30.687 15.4747L48.743 2.00144H53.3257ZM-5.3332 2.00144L16.5722 18.1326H11.073L-5.3332 5.85093V2.00144Z" fill="#C8102E" />
        <path d="M16.7555 2.00144V45.9956H31.4203V2.00144H16.7555ZM-5.3332 16.6662V31.3309H53.3257V16.6662H-5.3332Z" fill="white" />
        <path d="M-5.3332 19.6908V28.4896H53.3257V19.6908H-5.3332ZM19.6885 2.00144V45.9956H28.4873V2.00144H19.6885Z" fill="#C8102E" />
      </g>
    </svg>
  );
}

export function FlagRO({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
      <mask id="flag-ro-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="44" height="44">
        <circle cx="24" cy="24" r="22" fill="#D9D9D9" />
      </mask>
      <g mask="url(#flag-ro-mask)">
        <rect x="0" y="0" width="16" height="48" fill="#002B7F" />
        <rect x="16" y="0" width="16" height="48" fill="#FCD116" />
        <rect x="32" y="0" width="16" height="48" fill="#CE1126" />
      </g>
    </svg>
  );
}

/** Convenience: pick the flag by language code. */
export function Flag({ lang, className }: { lang: "ro" | "en"; className?: string }) {
  return lang === "ro" ? <FlagRO className={className} /> : <FlagGB className={className} />;
}
