-- Testimonials + FAQ schema for Supabase.
-- Run in the dashboard → SQL Editor → New query → Run. Safe to re-run.

-- ── Testimonials (single language: name + quote) ─────────────────────────────
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  quote      text not null default '',
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials read published" on public.testimonials;
create policy "testimonials read published"
  on public.testimonials for select using (published = true);

drop policy if exists "testimonials admin all" on public.testimonials;
create policy "testimonials admin all"
  on public.testimonials for all to authenticated using (true) with check (true);

-- ── FAQ (bilingual: question + answer + category) ────────────────────────────
create table if not exists public.faq (
  id           uuid primary key default gen_random_uuid(),
  question_ro  text not null default '',
  question_en  text not null default '',
  answer_ro    text not null default '',
  answer_en    text not null default '',
  category_ro  text not null default '',
  category_en  text not null default '',
  show_on_homepage boolean not null default false,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Add the homepage flag if the table already existed before this column.
alter table public.faq add column if not exists show_on_homepage boolean not null default false;

alter table public.faq enable row level security;

drop policy if exists "faq read published" on public.faq;
create policy "faq read published"
  on public.faq for select using (published = true);

drop policy if exists "faq admin all" on public.faq;
create policy "faq admin all"
  on public.faq for all to authenticated using (true) with check (true);
