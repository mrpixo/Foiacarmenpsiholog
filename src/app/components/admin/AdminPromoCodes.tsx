import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../lib/auth";
import {
  listPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  type PromoCode,
} from "../../lib/promo";
import { AdminTabs } from "./AdminTabs";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
const INPUT =
  "w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15";

export function AdminPromoCodes() {
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const ro = language === "ro";
  const [items, setItems] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");

  const load = () => {
    setLoading(true);
    listPromoCodes().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const add = async () => {
    if (!code.trim()) return;
    setError(null);
    try {
      await createPromoCode({ code: code.trim(), label: label.trim() });
      setCode("");
      setLabel("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString(ro ? "ro-RO" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <section className="w-full px-6 pb-24 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#39342e]" style={FONT}>{ro ? "Coduri promoționale" : "Promo codes"}</h1>
            <p className="text-sm text-[#5c554d]" style={FONT}>
              {ro ? "Codurile active oferă o ședință gratuită la programare." : "Active codes unlock a free session at booking."}
            </p>
          </div>
          <button type="button" onClick={async () => { await signOut(); }} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 py-2.5 text-sm font-medium text-[#5c554d] hover:text-[#d32c26]" style={FONT}>
            <LogOut size={16} /> {ro ? "Ieșire" : "Sign out"}
          </button>
        </div>

        <AdminTabs />

        {/* Add form */}
        <div className="mb-8 rounded-2xl border border-[#e4dcd3] bg-white p-6" style={FONT}>
          <h2 className="mb-4 font-semibold text-[#39342e]">{ro ? "Adaugă cod" : "Add code"}</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className={`${INPUT} sm:w-48 uppercase`}
              placeholder={ro ? "COD (ex. GRATIS2026)" : "CODE (e.g. FREE2026)"}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <input className={INPUT} placeholder={ro ? "Notă internă (opțional)" : "Internal note (optional)"} value={label} onChange={(e) => setLabel(e.target.value)} />
            <button type="button" onClick={add} className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#054943]">
              <Plus size={16} /> {ro ? "Adaugă" : "Add"}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-[#d32c26]" style={FONT}>{error}</p>}
        {loading ? (
          <p className="text-[#5c554d]" style={FONT}>…</p>
        ) : items.length === 0 ? (
          <p className="text-[#5c554d]" style={FONT}>{ro ? "Niciun cod încă." : "No codes yet."}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4dcd3] bg-white p-4" style={FONT}>
                <span className="rounded-lg bg-[#006960]/8 px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-[#006960]">{c.code}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.active ? "bg-[#006960]/10 text-[#006960]" : "bg-[#a89f95]/15 text-[#a89f95]"}`}>
                  {c.active ? (ro ? "Activ" : "Active") : (ro ? "Inactiv" : "Inactive")}
                </span>
                {c.label && <span className="text-sm text-[#5c554d]">{c.label}</span>}
                <span className="text-xs text-[#a89f95]">{fmtDate(c.created_at)}</span>
                <div className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={async () => { await updatePromoCode(c.id, { active: !c.active }); load(); }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#5c554d] hover:text-[#006960]">
                    {c.active ? <><EyeOff size={15} /> {ro ? "Dezactivează" : "Disable"}</> : <><Eye size={15} /> {ro ? "Activează" : "Enable"}</>}
                  </button>
                  <button type="button" onClick={async () => { if (window.confirm(ro ? "Ștergi codul?" : "Delete code?")) { await deletePromoCode(c.id); load(); } }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#5c554d] hover:text-[#d32c26]">
                    <Trash2 size={15} /> {ro ? "Șterge" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
