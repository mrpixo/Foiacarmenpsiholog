-- Promo codes for free sessions.
-- Run in the dashboard → SQL Editor → New query → Run. Safe to re-run.
--
-- Security model: the public must NOT be able to list valid codes, so there is
-- NO public select policy on the table. Validation happens through the
-- SECURITY DEFINER function `validate_promo_code(text)`, which only answers
-- "is this one code valid?" — it never exposes the code list. Only the
-- authenticated admin can read/manage the table.

create table if not exists public.promo_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,          -- matched case-insensitively
  label       text not null default '',      -- internal note, e.g. "Free session – campaign X"
  active      boolean not null default true,
  expires_at  timestamptz,                   -- null = never expires
  created_at  timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

-- Admin (authenticated) can do everything. No anon/public select policy on purpose.
drop policy if exists "promo_codes admin all" on public.promo_codes;
create policy "promo_codes admin all"
  on public.promo_codes for all to authenticated using (true) with check (true);

-- Public validation: returns true only if the code exists, is active and not expired.
-- Runs as definer so it can read the table even though anon has no select policy.
create or replace function public.validate_promo_code(p_code text)
returns boolean
language sql
security definer
set search_path = public
as $$
  -- Compare case- and whitespace-insensitively so a stray space (or copy/paste
  -- vs. typing) can never cause a mismatch.
  select exists (
    select 1 from public.promo_codes
    where upper(regexp_replace(code, '\s', '', 'g')) = upper(regexp_replace(p_code, '\s', '', 'g'))
      and active = true
      and (expires_at is null or expires_at > now())
  );
$$;

grant execute on function public.validate_promo_code(text) to anon, authenticated;
