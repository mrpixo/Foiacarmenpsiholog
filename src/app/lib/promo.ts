import { supabase } from "./supabase";

export type PromoCode = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

export type PromoCodeInput = {
  code: string;
  label?: string;
  active?: boolean;
  expires_at?: string | null;
};

// ── Public validation (no table access — uses the SECURITY DEFINER RPC) ───────
/** True if the code exists, is active and not expired. Never exposes the list. */
export async function validatePromoCode(code: string): Promise<boolean> {
  const trimmed = code.trim();
  if (!trimmed) return false;
  const { data, error } = await supabase.rpc("validate_promo_code", { p_code: trimmed });
  if (error) throw error;
  return data === true;
}

// ── Admin CRUD (require authenticated session) ───────────────────────────────
export async function listPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPromoCode(input: PromoCodeInput): Promise<PromoCode> {
  const { data, error } = await supabase
    .from("promo_codes")
    .insert({ ...input, code: input.code.trim() })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updatePromoCode(id: string, input: Partial<PromoCodeInput>): Promise<void> {
  const { error } = await supabase.from("promo_codes").update(input).eq("id", id);
  if (error) throw error;
}

export async function deletePromoCode(id: string): Promise<void> {
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw error;
}
