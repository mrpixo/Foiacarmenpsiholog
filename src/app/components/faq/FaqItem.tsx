const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Accordion FAQ item — shared by the homepage section and the FAQ page. */
export function FaqItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <article
      className={[
        "overflow-hidden rounded-3xl transition-[background-color,box-shadow] duration-300",
        isOpen ? "bg-[#006960] shadow-[0_22px_70px_rgba(0,105,96,0.18)]" : "bg-[#fbf9f8] shadow-none hover:bg-[#f7f0eb]",
      ].join(" ")}
    >
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={[
            "group flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 text-left outline-none md:px-8 md:py-6",
            "focus-visible:ring-2 focus-visible:ring-[#d9b46f] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            isOpen ? "text-white" : "text-[#39342e]",
          ].join(" ")}
        >
          <span className="flex-1 font-medium leading-snug" style={{ ...FONT, fontSize: "clamp(16px,1.5vw,22px)" }}>
            {question}
          </span>
          <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={["transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen ? "rotate-45" : "rotate-0"].join(" ")}>
              <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={["grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={["whitespace-pre-line px-6 pb-6 pr-14 leading-relaxed transition-colors duration-300 md:px-8 md:pb-8 md:pr-20", isOpen ? "text-white/82" : "text-[#39342e]/70"].join(" ")}
            style={{ ...FONT, fontSize: "clamp(14px,1.3vw,17px)" }}
          >
            {answer}
          </p>
        </div>
      </div>
    </article>
  );
}
