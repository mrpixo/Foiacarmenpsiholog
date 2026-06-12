-- News / "Ultimele noutăți" schema for Supabase.
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run.

create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  status        text not null default 'draft' check (status in ('draft','published')),
  title_ro      text not null default '',
  title_en      text not null default '',
  excerpt_ro    text not null default '',
  excerpt_en    text not null default '',
  body_ro       text not null default '',   -- rich text (HTML, incl. carousel + video nodes)
  body_en       text not null default '',
  cover_url     text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists news_status_idx       on public.news (status);
create index if not exists news_published_at_idx  on public.news (published_at desc);

-- Reuse the shared updated_at trigger function (created by schema.sql). Define it
-- here too so this file can run standalone.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- ── Row-Level Security ──────────────────────────────────────────────────────
alter table public.news enable row level security;

drop policy if exists "news read published" on public.news;
create policy "news read published"
  on public.news for select
  using (status = 'published');

drop policy if exists "news admin all" on public.news;
create policy "news admin all"
  on public.news for all
  to authenticated
  using (true) with check (true);
