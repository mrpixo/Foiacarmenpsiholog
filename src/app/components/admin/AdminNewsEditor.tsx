import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Save, Send, ImageIcon, X } from "lucide-react";
import { useLanguage } from "../../i18n";
import { slugify } from "../../lib/articles";
import { getNewsById, createNews, updateNews, setNewsStatus, type NewsInput } from "../../lib/news";
import { translate, hasContent } from "../../lib/translate";
import { RichTextEditor } from "./RichTextEditor";
import { MediaLibrary } from "./MediaLibrary";
import { Flag } from "../Flags";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;
const INPUT =
  "w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] text-[#39342e] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15";

const empty: NewsInput = {
  slug: "",
  title_ro: "",
  title_en: "",
  excerpt_ro: "",
  excerpt_en: "",
  body_ro: "",
  body_en: "",
  cover_url: null,
};

export function AdminNewsEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { language } = useLanguage();
  const ro = language === "ro";
  const navigate = useNavigate();

  const [form, setForm] = useState<NewsInput>(empty);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tab, setTab] = useState<"ro" | "en">("ro");
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Media library: single pick (cover, inline image) or multi pick (carousel).
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaMulti, setMediaMulti] = useState(false);
  const oneResolver = useRef<((url: string | null) => void) | null>(null);
  const manyResolver = useRef<((urls: string[] | null) => void) | null>(null);

  const openMedia = () =>
    new Promise<string | null>((resolve) => {
      oneResolver.current = resolve;
      setMediaMulti(false);
      setMediaOpen(true);
    });
  const openMediaMany = () =>
    new Promise<string[] | null>((resolve) => {
      manyResolver.current = resolve;
      setMediaMulti(true);
      setMediaOpen(true);
    });
  const resolveOne = (url: string | null) => { setMediaOpen(false); oneResolver.current?.(url); oneResolver.current = null; };
  const resolveMany = (urls: string[] | null) => { setMediaOpen(false); manyResolver.current?.(urls); manyResolver.current = null; };

  useEffect(() => {
    if (id) {
      getNewsById(id).then((n) => {
        if (!n) return;
        setForm({
          slug: n.slug,
          title_ro: n.title_ro,
          title_en: n.title_en,
          excerpt_ro: n.excerpt_ro,
          excerpt_en: n.excerpt_en,
          body_ro: n.body_ro,
          body_en: n.body_en,
          cover_url: n.cover_url,
        });
        setStatus(n.status);
        setSlugTouched(true);
      });
    }
  }, [id]);

  const set = <K extends keyof NewsInput>(key: K, val: NewsInput[K]) => setForm((f) => ({ ...f, [key]: val }));
  const onTitleRo = (val: string) => setForm((f) => ({ ...f, title_ro: val, slug: slugTouched ? f.slug : slugify(val) }));

  const fillMissingLanguage = async (base: NewsInput): Promise<NewsInput> => {
    const roFilled = hasContent(base.title_ro, base.body_ro);
    const enFilled = hasContent(base.title_en, base.body_en);
    if (roFilled && !enFilled) {
      setTranslating(true);
      const r = await translate({ source: "ro", target: "en", plain: [base.title_ro, base.excerpt_ro], html: [base.body_ro] });
      return { ...base, title_en: r.plain[0] ?? "", excerpt_en: r.plain[1] ?? "", body_en: r.html[0] ?? "" };
    }
    if (enFilled && !roFilled) {
      setTranslating(true);
      const r = await translate({ source: "en", target: "ro", plain: [base.title_en, base.excerpt_en], html: [base.body_en] });
      return { ...base, title_ro: r.plain[0] ?? "", excerpt_ro: r.plain[1] ?? "", body_ro: r.html[0] ?? "" };
    }
    return base;
  };

  const persist = async (publishAfter: boolean) => {
    setBusy(true);
    setError(null);
    try {
      let payload: NewsInput = { ...form, slug: form.slug || slugify(form.title_ro) || slugify(form.title_en) };
      if (publishAfter) {
        payload = await fillMissingLanguage(payload);
        setTranslating(false);
        setForm(payload);
      }
      let newsId = id;
      if (isEdit && newsId) await updateNews(newsId, payload);
      else { const created = await createNews(payload); newsId = created.id; }
      if (publishAfter && newsId) await setNewsStatus(newsId, "published");
      navigate("/admin/news");
    } catch (e) {
      setTranslating(false);
      setError((e as Error).message ?? String(e));
      setBusy(false);
    }
  };

  return (
    <section className="w-full px-6 pb-32 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[860px]">
        <Link to="/admin/news" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#006960] hover:text-[#054943]" style={FONT}>
          <ArrowLeft size={16} /> {ro ? "Înapoi" : "Back"}
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-[#39342e]" style={FONT}>
          {isEdit ? (ro ? "Editează noutate" : "Edit update") : ro ? "Noutate nouă" : "New update"}
        </h1>

        {/* Language tabs */}
        <div className="mb-6 inline-flex rounded-full border border-[#e4dcd3] bg-white p-1" style={FONT}>
          {(["ro", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={["flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors", tab === l ? "bg-[#006960] text-white" : "text-[#5c554d] hover:text-[#006960]"].join(" ")}
            >
              <Flag lang={l} className="size-5" />
              {l === "ro" ? "Română" : "English"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5" style={FONT}>
          <Labeled label={ro ? "Titlu" : "Title"}>
            {tab === "ro" ? (
              <input className={INPUT} value={form.title_ro} onChange={(e) => onTitleRo(e.target.value)} placeholder="Titlu noutate" />
            ) : (
              <input className={INPUT} value={form.title_en} onChange={(e) => set("title_en", e.target.value)} placeholder="Update title" />
            )}
          </Labeled>

          <Labeled label={ro ? "Descriere (apare pe card)" : "Description (shown on cards)"}>
            {tab === "ro" ? (
              <textarea rows={2} className={`${INPUT} resize-none`} value={form.excerpt_ro} onChange={(e) => set("excerpt_ro", e.target.value)} />
            ) : (
              <textarea rows={2} className={`${INPUT} resize-none`} value={form.excerpt_en} onChange={(e) => set("excerpt_en", e.target.value)} />
            )}
          </Labeled>

          <Labeled label={ro ? "Conținut (text, imagini, video, carusel)" : "Body (text, images, video, carousel)"}>
            {tab === "ro" ? (
              <RichTextEditor value={form.body_ro} onChange={(html) => set("body_ro", html)} placeholder={ro ? "Scrie noutatea..." : "Write the update..."} onPickImage={openMedia} onPickImages={openMediaMany} enableVideo />
            ) : (
              <RichTextEditor value={form.body_en} onChange={(html) => set("body_en", html)} placeholder="Write the update..." onPickImage={openMedia} onPickImages={openMediaMany} enableVideo />
            )}
          </Labeled>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Labeled label={ro ? "Imagine thumbnail (opțional)" : "Thumbnail image (optional)"}>
              {form.cover_url ? (
                <div className="relative overflow-hidden rounded-xl border border-[#e4dcd3]">
                  <img src={form.cover_url} alt="" className="h-28 w-full object-cover" />
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <button type="button" onClick={() => openMedia().then((url) => url && set("cover_url", url))} className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#006960] hover:bg-white">{ro ? "Schimbă" : "Change"}</button>
                    <button type="button" onClick={() => set("cover_url", null)} title={ro ? "Elimină" : "Remove"} className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-[#5c554d] hover:text-[#d32c26]"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => openMedia().then((url) => url && set("cover_url", url))} className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e4dcd3] text-sm text-[#5c554d] transition-colors hover:border-[#006960] hover:text-[#006960]">
                  <ImageIcon size={22} />
                  {ro ? "Alege din bibliotecă" : "Choose from library"}
                </button>
              )}
            </Labeled>
            <Labeled label="Slug (URL)">
              <input className={INPUT} value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} placeholder="titlu-noutate" />
            </Labeled>
          </div>

          {error && <p className="text-sm text-[#d32c26]">{error}</p>}

          <div className="mt-2 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={() => persist(false)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#006960] bg-white px-6 py-3 font-semibold text-[#006960] transition-colors hover:bg-[#006960]/8 disabled:opacity-60">
              <Save size={18} /> {ro ? "Salvează ciornă" : "Save draft"}
            </button>
            <button type="button" disabled={busy} onClick={() => persist(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#006960] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#054943] disabled:opacity-60">
              <Send size={18} />{" "}
              {translating ? (ro ? "Se traduce..." : "Translating...") : status === "published" ? (ro ? "Salvează și republică" : "Save & republish") : ro ? "Publică" : "Publish"}
            </button>
          </div>
          <p className="-mt-1 text-xs text-[#a89f95]">
            {ro ? "La publicare, dacă ai scris doar într-o limbă, cealaltă este tradusă automat." : "On publish, if you wrote only one language, the other is translated automatically."}
          </p>
        </div>
      </div>

      {mediaOpen && (
        <MediaLibrary
          multiple={mediaMulti}
          onSelect={(url) => resolveOne(url)}
          onSelectMany={(urls) => resolveMany(urls)}
          onClose={() => (mediaMulti ? resolveMany(null) : resolveOne(null))}
        />
      )}
    </section>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#39342e]">{label}</span>
      {children}
    </label>
  );
}
