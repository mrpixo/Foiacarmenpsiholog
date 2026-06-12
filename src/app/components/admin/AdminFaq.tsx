import { useEffect, useMemo, useRef, useState } from "react";
import { LogOut, Plus, Trash2, Eye, EyeOff, Pencil, X, Check } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../lib/auth";
import { listAllFaq, createFaq, updateFaq, deleteFaq, type Faq, type FaqInput } from "../../lib/community";
import { translate } from "../../lib/translate";
import { AdminTabs } from "./AdminTabs";
import { Flag } from "../Flags";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
const INPUT =
  "w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15";

const empty: FaqInput = { question_ro: "", question_en: "", answer_ro: "", answer_en: "", category_ro: "", category_en: "", show_on_homepage: false };

export function AdminFaq() {
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const ro = language === "ro";
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FaqInput>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"ro" | "en">("ro");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    listAllFaq().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Distinct existing categories (bilingual pairs) for the searchable picker.
  const categories = useMemo(() => {
    const map = new Map<string, { ro: string; en: string }>();
    for (const f of items) {
      const key = f.category_ro.trim();
      if (key && !map.has(key)) map.set(key, { ro: f.category_ro, en: f.category_en });
    }
    return Array.from(map.values());
  }, [items]);

  const set = <K extends keyof FaqInput>(k: K, v: FaqInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(empty); setEditingId(null); setTab("ro"); };

  const startEdit = (f: Faq) => {
    setEditingId(f.id);
    setForm({ question_ro: f.question_ro, question_en: f.question_en, answer_ro: f.answer_ro, answer_en: f.answer_en, category_ro: f.category_ro, category_en: f.category_en, show_on_homepage: f.show_on_homepage });
    setTab("ro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      let payload = { ...form };
      const roFilled = !!(payload.question_ro.trim() || payload.answer_ro.trim());
      const enFilled = !!(payload.question_en.trim() || payload.answer_en.trim());
      // Auto-translate the empty language.
      if (roFilled && !enFilled) {
        const r = await translate({ source: "ro", target: "en", plain: [payload.question_ro, payload.answer_ro, payload.category_ro], html: [] });
        payload = { ...payload, question_en: r.plain[0] ?? "", answer_en: r.plain[1] ?? "", category_en: r.plain[2] ?? "" };
      } else if (enFilled && !roFilled) {
        const r = await translate({ source: "en", target: "ro", plain: [payload.question_en, payload.answer_en, payload.category_en], html: [] });
        payload = { ...payload, question_ro: r.plain[0] ?? "", answer_ro: r.plain[1] ?? "", category_ro: r.plain[2] ?? "" };
      }
      if (editingId) await updateFaq(editingId, payload);
      else await createFaq(payload);
      reset();
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="w-full px-6 pb-24 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#39342e]" style={FONT}>{ro ? "Întrebări frecvente" : "FAQ"}</h1>
            <p className="text-sm text-[#5c554d]" style={FONT}>{ro ? "Ultimele 6 apar pe homepage" : "The latest 6 appear on the homepage"}</p>
          </div>
          <button type="button" onClick={async () => { await signOut(); }} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 py-2.5 text-sm font-medium text-[#5c554d] hover:text-[#d32c26]" style={FONT}>
            <LogOut size={16} /> {ro ? "Ieșire" : "Sign out"}
          </button>
        </div>

        <AdminTabs />

        {/* Form */}
        <div className="mb-8 rounded-2xl border border-[#e4dcd3] bg-white p-6" style={FONT}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#39342e]">
              {editingId ? (ro ? "Editează întrebarea" : "Edit question") : ro ? "Adaugă întrebare" : "Add question"}
            </h2>
            {editingId && (
              <button type="button" onClick={reset} className="inline-flex cursor-pointer items-center gap-1 text-sm text-[#5c554d] hover:text-[#006960]">
                <X size={14} /> {ro ? "Renunță" : "Cancel"}
              </button>
            )}
          </div>

          <div className="mb-4 inline-flex rounded-full border border-[#e4dcd3] p-1">
            {(["ro", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setTab(l)} className={["flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors", tab === l ? "bg-[#006960] text-white" : "text-[#5c554d]"].join(" ")}>
                <Flag lang={l} className="size-4" /> {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {tab === "ro" ? (
              <>
                <input className={INPUT} placeholder="Întrebare" value={form.question_ro} onChange={(e) => set("question_ro", e.target.value)} />
                <textarea className={`${INPUT} resize-none`} rows={3} placeholder="Răspuns" value={form.answer_ro} onChange={(e) => set("answer_ro", e.target.value)} />
              </>
            ) : (
              <>
                <input className={INPUT} placeholder="Question" value={form.question_en} onChange={(e) => set("question_en", e.target.value)} />
                <textarea className={`${INPUT} resize-none`} rows={3} placeholder="Answer" value={form.answer_en} onChange={(e) => set("answer_en", e.target.value)} />
              </>
            )}

            {/* Category — searchable: pick an existing one or create a new one */}
            <CategoryCombobox
              categories={categories}
              language={tab}
              valueRo={form.category_ro}
              valueEn={form.category_en}
              onSelectExisting={(c) => setForm((f) => ({ ...f, category_ro: c.ro, category_en: c.en }))}
              onCreate={(name) => setForm((f) => (tab === "ro" ? { ...f, category_ro: name, category_en: "" } : { ...f, category_en: name, category_ro: "" }))}
              ro={ro}
            />

            {/* Homepage flag — the "homepage category" applied on top */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3">
              <input type="checkbox" checked={form.show_on_homepage} onChange={(e) => set("show_on_homepage", e.target.checked)} className="size-4 accent-[#006960]" />
              <span className="text-sm text-[#39342e]">{ro ? "Afișează și pe homepage (categoria „Homepage”)" : "Also show on the homepage"}</span>
            </label>

            <button type="button" disabled={busy} onClick={save} className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#054943] disabled:opacity-60">
              <Plus size={16} /> {busy ? (ro ? "Se salvează..." : "Saving...") : editingId ? (ro ? "Salvează" : "Save") : ro ? "Adaugă" : "Add"}
            </button>
            <p className="text-xs text-[#a89f95]">{ro ? "Dacă scrii doar o limbă, cealaltă se traduce automat la salvare." : "If you fill only one language, the other is auto-translated on save."}</p>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-[#d32c26]" style={FONT}>{error}</p>}
        {loading ? (
          <p className="text-[#5c554d]" style={FONT}>…</p>
        ) : items.length === 0 ? (
          <p className="text-[#5c554d]" style={FONT}>{ro ? "Nicio întrebare încă." : "No questions yet."}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e4dcd3] bg-white" style={FONT}>
            {items.map((f, i) => (
              <div key={f.id} className={["flex flex-wrap items-center gap-4 px-5 py-4", i > 0 ? "border-t border-[#f0e9e2]" : ""].join(" ")}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[#39342e]">{ro ? f.question_ro : f.question_en}</span>
                    {f.show_on_homepage && <span className="rounded-full bg-[#006960]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#006960]">Homepage</span>}
                    {!f.published && <span className="rounded-full bg-[#ffba68]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#9a6a1e]">{ro ? "Ascuns" : "Hidden"}</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-[#a89f95]">{(ro ? f.category_ro : f.category_en) || (ro ? "Fără categorie" : "No category")}</div>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => startEdit(f)} title={ro ? "Editează" : "Edit"}><Pencil size={16} /></IconBtn>
                  <IconBtn onClick={async () => { await updateFaq(f.id, { published: !f.published }); load(); }} title={f.published ? (ro ? "Ascunde" : "Hide") : (ro ? "Afișează" : "Show")}>
                    {f.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconBtn>
                  <IconBtn danger onClick={async () => { if (window.confirm(ro ? "Ștergi?" : "Delete?")) { await deleteFaq(f.id); load(); } }} title={ro ? "Șterge" : "Delete"}><Trash2 size={16} /></IconBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type Cat = { ro: string; en: string };

function CategoryCombobox({
  categories,
  language,
  valueRo,
  valueEn,
  onSelectExisting,
  onCreate,
  ro,
}: {
  categories: Cat[];
  language: "ro" | "en";
  valueRo: string;
  valueEn: string;
  onSelectExisting: (c: Cat) => void;
  onCreate: (name: string) => void;
  ro: boolean;
}) {
  const selectedName = language === "ro" ? valueRo : valueEn;
  const [query, setQuery] = useState(selectedName);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the field in sync when the form value changes (e.g. editing / tab switch).
  useEffect(() => setQuery(selectedName), [selectedName]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const name = (c: Cat) => (language === "ro" ? c.ro : c.en);
  const matches = categories.filter((c) => name(c).toLowerCase().includes(q));
  const exact = categories.some((c) => name(c).toLowerCase() === q);

  return (
    <div className="relative" ref={boxRef}>
      <label className="mb-2 block text-sm font-medium text-[#39342e]">{ro ? "Categorie" : "Category"}</label>
      <input
        className="w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15"
        placeholder={ro ? "Caută sau creează o categorie..." : "Search or create a category..."}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#e4dcd3] bg-white p-1 shadow-xl">
          {matches.map((c) => (
            <button
              key={c.ro}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onSelectExisting(c); setQuery(name(c)); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#39342e] hover:bg-[#f5eee9]"
            >
              <span>{name(c)}</span>
              {name(c).toLowerCase() === q && <Check size={15} className="text-[#006960]" />}
            </button>
          ))}
          {q && !exact && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onCreate(query.trim()); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#006960] hover:bg-[#006960]/8"
            >
              <Plus size={15} /> {ro ? `Creează „${query.trim()}"` : `Create "${query.trim()}"`}
            </button>
          )}
          {matches.length === 0 && !q && (
            <p className="px-3 py-2 text-sm text-[#a89f95]">{ro ? "Scrie pentru a căuta sau crea." : "Type to search or create."}</p>
          )}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} title={title} className={["flex size-9 items-center justify-center rounded-lg transition-colors cursor-pointer", danger ? "text-[#5c554d] hover:bg-[#d32c26]/10 hover:text-[#d32c26]" : "text-[#5c554d] hover:bg-[#006960]/10 hover:text-[#006960]"].join(" ")}>
      {children}
    </button>
  );
}
