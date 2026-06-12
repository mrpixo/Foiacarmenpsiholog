import { useState, type ReactNode, type FormEvent } from "react";
import { useLanguage } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../lib/auth";
import { NotConfigured } from "../blog/NotConfigured";

const FONT = { fontFamily: "'Oakes Grotesk', 'Inter', sans-serif" } as const;

/** Wraps admin pages: shows a login form until an admin session exists. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-[760px] px-6 pb-24 pt-36 md:pt-44">
        <NotConfigured />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="px-6 pb-24 pt-44 text-center text-[#5c554d]" style={FONT}>…</div>
    );
  }
  if (!session) return <AdminLogin />;
  return <>{children}</>;
}

function AdminLogin() {
  const { language } = useLanguage();
  const { signIn } = useAuth();
  const ro = language === "ro";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setBusy(false);
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-24">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-3xl border border-[#e4dcd3] bg-white p-8 shadow-[0_8px_40px_rgba(0,105,96,0.08)]"
        style={FONT}
      >
        <h1 className="text-2xl font-bold text-[#39342e]">{ro ? "Administrare blog" : "Blog admin"}</h1>
        <p className="mt-1 text-sm text-[#5c554d]">{ro ? "Autentifică-te pentru a continua." : "Sign in to continue."}</p>

        <label className="mt-6 block text-sm font-medium text-[#39342e]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] outline-none focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15"
        />

        <label className="mt-4 block text-sm font-medium text-[#39342e]">{ro ? "Parolă" : "Password"}</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[#e4dcd3] bg-[#faf6f2] px-4 py-3 text-[15px] outline-none focus:border-[#006960] focus:bg-white focus:ring-2 focus:ring-[#006960]/15"
        />

        {error && <p className="mt-3 text-sm text-[#d32c26]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full cursor-pointer rounded-full bg-[#006960] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#054943] disabled:opacity-60"
        >
          {busy ? "…" : ro ? "Autentificare" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
