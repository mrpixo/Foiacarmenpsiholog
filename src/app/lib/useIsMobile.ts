import { useEffect, useState } from "react";

/** True when the viewport is below the `md` breakpoint (768px). */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/**
 * Entrance-offset helper: on mobile every section assembles bottom→top;
 * on desktop it can slide horizontally. Returns the `initial` x/y offsets.
 */
export function entrance(isMobile: boolean, desktopX: number, y = 24): { x: number; y: number } {
  return isMobile ? { x: 0, y } : { x: desktopX, y: 0 };
}
