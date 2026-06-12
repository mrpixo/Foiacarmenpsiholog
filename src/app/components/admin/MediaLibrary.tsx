import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, X, Check } from "lucide-react";
import { useLanguage } from "../../i18n";
import { listMedia, uploadMedia, deleteMedia, type MediaItem } from "../../lib/media";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
  /** When true, the user picks several images and confirms with a button. */
  multiple?: boolean;
  onSelectMany?: (urls: string[]) => void;
};

/** Modal media library: upload images and pick one (or several). */
export function MediaLibrary({ onSelect, onClose, multiple, onSelectMany }: Props) {
  const { language } = useLanguage();
  const ro = language === "ro";
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggle = (url: string) =>
    setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]));

  const load = () => {
    setLoading(true);
    listMedia()
      .then(setItems)
      .catch((e) => setError(e.message ?? String(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await uploadMedia(file);
      }
      load();
    } catch (e) {
      setError((e as Error).message ?? String(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (item: MediaItem) => {
    if (!window.confirm(ro ? "Ștergi această imagine?" : "Delete this image?")) return;
    await deleteMedia(item.name);
    load();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4" style={FONT} onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-[820px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4dcd3] px-6 py-4">
          <h2 className="text-lg font-bold text-[#39342e]">{ro ? "Bibliotecă media" : "Media library"}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#006960] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#054943] disabled:opacity-60"
            >
              <Upload size={15} /> {uploading ? (ro ? "Se încarcă..." : "Uploading...") : ro ? "Încarcă" : "Upload"}
            </button>
            <button type="button" onClick={onClose} className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#5c554d] hover:bg-[#f5eee9]">
              <X size={18} />
            </button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && <p className="mb-4 text-sm text-[#d32c26]">{error}</p>}
          {loading ? (
            <p className="text-[#5c554d]">…</p>
          ) : items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#e4dcd3] py-16 text-center text-[#5c554d]"
            >
              <Upload size={28} className="text-[#a89f95]" />
              <p>{ro ? "Nicio imagine încă. Apasă „Încarcă”." : "No images yet. Click “Upload”."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => {
                const isSel = selected.includes(item.url);
                return (
                  <div key={item.name} className="group relative overflow-hidden rounded-xl border border-[#e4dcd3] bg-[#f5eee9]">
                    <button
                      type="button"
                      onClick={() => (multiple ? toggle(item.url) : onSelect(item.url))}
                      className="block aspect-square w-full cursor-pointer"
                      title={ro ? "Selectează" : "Select"}
                    >
                      <img src={item.url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <span className={["absolute inset-0 flex items-center justify-center transition-all duration-200", multiple && isSel ? "bg-[#006960]/40 opacity-100" : "bg-[#006960]/0 opacity-0 group-hover:bg-[#006960]/30 group-hover:opacity-100"].join(" ")}>
                        <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#006960]"><Check size={18} /></span>
                      </span>
                      {multiple && isSel && (
                        <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-[#006960] text-xs font-bold text-white">
                          {selected.indexOf(item.url) + 1}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      title={ro ? "Șterge" : "Delete"}
                      className="absolute right-1.5 top-1.5 flex size-7 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-[#5c554d] opacity-0 transition-opacity hover:text-[#d32c26] group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Multi-select footer */}
        {multiple && (
          <div className="flex items-center justify-between border-t border-[#e4dcd3] px-6 py-4">
            <span className="text-sm text-[#5c554d]">
              {selected.length} {ro ? "selectate" : "selected"}
            </span>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => onSelectMany?.(selected)}
              className="cursor-pointer rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#054943] disabled:opacity-50"
            >
              {ro ? "Adaugă în carusel" : "Add to carousel"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
