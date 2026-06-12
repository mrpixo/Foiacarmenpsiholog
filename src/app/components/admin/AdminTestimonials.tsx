import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../lib/auth";
import {
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "../../lib/community";
import { AdminTabs } from "./AdminTabs";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
const INPUT =
  "w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15";

export function AdminTestimonials() {
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const ro = language === "ro";
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");

  const load = () => {
    setLoading(true);
    listAllTestimonials().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const add = async () => {
    if (!name.trim() || !quote.trim()) return;
    await createTestimonial({ name: name.trim(), quote: quote.trim() });
    setName("");
    setQuote("");
    load();
  };

  return (
    <section className="w-full px-6 pb-24 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#39342e]" style={FONT}>{ro ? "Testimoniale" : "Testimonials"}</h1>
            <p className="text-sm text-[#5c554d]" style={FONT}>{ro ? "Ultimele 5 apar pe homepage" : "The latest 5 appear on the homepage"}</p>
          </div>
          <button type="button" onClick={async () => { await signOut(); }} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 py-2.5 text-sm font-medium text-[#5c554d] hover:text-[#d32c26]" style={FONT}>
            <LogOut size={16} /> {ro ? "Ieșire" : "Sign out"}
          </button>
        </div>

        <AdminTabs />

        {/* Add form */}
        <div className="mb-8 rounded-2xl border border-[#e4dcd3] bg-white p-6" style={FONT}>
          <h2 className="mb-4 font-semibold text-[#39342e]">{ro ? "Adaugă testimonial" : "Add testimonial"}</h2>
          <div className="flex flex-col gap-3">
            <input className={INPUT} placeholder={ro ? "Nume (cine a dat review)" : "Name"} value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className={`${INPUT} resize-none`} rows={3} placeholder={ro ? "Review-ul..." : "The review..."} value={quote} onChange={(e) => setQuote(e.target.value)} />
            <button type="button" onClick={add} className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#054943]">
              <Plus size={16} /> {ro ? "Adaugă" : "Add"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-[#d32c26]" style={FONT}>{error}</p>}
        {loading ? (
          <p className="text-[#5c554d]" style={FONT}>…</p>
        ) : items.length === 0 ? (
          <p className="text-[#5c554d]" style={FONT}>{ro ? "Niciun testimonial încă." : "No testimonials yet."}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((t) => (
              <TestimonialRow key={t.id} item={t} onChanged={load} ro={ro} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialRow({ item, onChanged, ro }: { item: Testimonial; onChanged: () => void; ro: boolean }) {
  const [name, setName] = useState(item.name);
  const [quote, setQuote] = useState(item.quote);
  const dirty = name !== item.name || quote !== item.quote;

  return (
    <div className="rounded-2xl border border-[#e4dcd3] bg-white p-5" style={FONT}>
      <input className={`${INPUT} mb-2`} value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className={`${INPUT} resize-none`} rows={2} value={quote} onChange={(e) => setQuote(e.target.value)} />
      <div className="mt-3 flex items-center gap-2">
        <button type="button" disabled={!dirty} onClick={async () => { await updateTestimonial(item.id, { name, quote }); onChanged(); }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#006960] px-4 py-2 text-sm font-semibold text-[#006960] hover:bg-[#006960]/8 disabled:opacity-40">
          <Save size={15} /> {ro ? "Salvează" : "Save"}
        </button>
        <button type="button" onClick={async () => { await updateTestimonial(item.id, { published: !item.published }); onChanged(); }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[#5c554d] hover:text-[#006960]">
          {item.published ? <><EyeOff size={15} /> {ro ? "Ascunde" : "Hide"}</> : <><Eye size={15} /> {ro ? "Afișează" : "Show"}</>}
        </button>
        <button type="button" onClick={async () => { if (window.confirm(ro ? "Ștergi?" : "Delete?")) { await deleteTestimonial(item.id); onChanged(); } }} className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[#5c554d] hover:text-[#d32c26]">
          <Trash2 size={15} /> {ro ? "Șterge" : "Delete"}
        </button>
      </div>
    </div>
  );
}
