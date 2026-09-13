/**
 * True when the server delivered prerendered HTML into #root (production
 * builds — see scripts/prerender.mjs). In that case the visitor is already
 * reading the content, so mount-time entrance animations must not re-hide it:
 * replaying them hides the page for ~1s after hydration (visible flash) and
 * pushes the Largest Contentful Paint to the end of the animation.
 *
 * Evaluated at module load, before React hydrates and replaces #root. The
 * plain SPA shell contains only a <noscript> fallback inside #root.
 */
export const wasPrerendered: boolean =
  typeof document !== "undefined" &&
  document.getElementById("root")?.firstElementChild != null &&
  document.getElementById("root")!.firstElementChild!.tagName !== "NOSCRIPT";
