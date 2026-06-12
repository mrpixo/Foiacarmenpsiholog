import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Pencil, Eye, EyeOff, Trash2, LogOut, ExternalLink } from "lucide-react";
import { useLanguage } from "../../i18n";
import { useAuth } from "../../lib/auth";
import { listAllNews, setNewsStatus, deleteNews, newsTitle, type NewsItem } from "../../lib/news";
import { AdminTabs } from "./AdminTabs";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

export function AdminNewsDashboard() {
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const ro = language === "ro";
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    listAllNews()
      .then(setItems)
      .catch((e) => setError(e.message ?? String(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const togglePublish = async (n: NewsItem) => {
    await setNewsStatus(n.id, n.status === "published" ? "draft" : "published");
    load();
  };
  const remove = async (n: NewsItem) => {
    if (!window.confirm(ro ? "Ștergi definitiv această noutate?" : "Permanently delete this update?")) return;
    await deleteNews(n.id);
    load();
  };

  return (
    <section className="w-full px-6 pb-24 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#39342e]" style={FONT}>{ro ? "Noutăți" : "News"}</h1>
            <p className="text-sm text-[#5c554d]" style={FONT}>{ro ? "Administrare noutăți" : "News admin"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => { await signOut(); }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 py-2.5 text-sm font-medium text-[#5c554d] transition-colors hover:text-[#d32c26]"
              style={FONT}
            >
              <LogOut size={16} /> {ro ? "Ieșire" : "Sign out"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/news/new")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#006960] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#054943]"
              style={FONT}
            >
              <Plus size={16} /> {ro ? "Noutate nouă" : "New update"}
            </button>
          </div>
        </div>

        <AdminTabs />

        {loading ? (
          <p className="text-[#5c554d]" style={FONT}>…</p>
        ) : error ? (
          <p className="text-[#d32c26]" style={FONT}>{error}</p>
        ) : items.length === 0 ? (
          <p className="text-[#5c554d]" style={FONT}>{ro ? "Nicio noutate încă." : "No updates yet."}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e4dcd3] bg-white">
            {items.map((n, i) => (
              <div key={n.id} className={["flex flex-wrap items-center gap-4 px-5 py-4", i > 0 ? "border-t border-[#f0e9e2]" : ""].join(" ")}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[#39342e]" style={FONT}>
                      {newsTitle(n, language) || (ro ? "(fără titlu)" : "(untitled)")}
                    </span>
                    <span
                      className={["rounded-full px-2.5 py-0.5 text-[11px] font-semibold", n.status === "published" ? "bg-[#006960]/10 text-[#006960]" : "bg-[#ffba68]/20 text-[#9a6a1e]"].join(" ")}
                      style={FONT}
                    >
                      {n.status === "published" ? (ro ? "Publicat" : "Published") : (ro ? "Ciornă" : "Draft")}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-[#a89f95]" style={FONT}>/{n.slug}</div>
                </div>
                <div className="flex items-center gap-1">
                  {n.status === "published" && (
                    <IconBtn to={`/noutati/${n.slug}`} title={ro ? "Vezi" : "View"}><ExternalLink size={16} /></IconBtn>
                  )}
                  <IconBtn to={`/admin/news/edit/${n.id}`} title={ro ? "Editează" : "Edit"}><Pencil size={16} /></IconBtn>
                  <IconBtn onClick={() => togglePublish(n)} title={n.status === "published" ? (ro ? "Retrage" : "Unpublish") : (ro ? "Publică" : "Publish")}>
                    {n.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconBtn>
                  <IconBtn onClick={() => remove(n)} title={ro ? "Șterge" : "Delete"} danger><Trash2 size={16} /></IconBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function IconBtn({ children, onClick, to, title, danger }: { children: React.ReactNode; onClick?: () => void; to?: string; title: string; danger?: boolean; }) {
  const cls = [
    "flex size-9 items-center justify-center rounded-lg transition-colors cursor-pointer",
    danger ? "text-[#5c554d] hover:bg-[#d32c26]/10 hover:text-[#d32c26]" : "text-[#5c554d] hover:bg-[#006960]/10 hover:text-[#006960]",
  ].join(" ");
  if (to) return <Link to={to} title={title} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} title={title} className={cls}>{children}</button>;
}
