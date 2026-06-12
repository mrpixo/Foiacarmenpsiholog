-- Blog schema for Supabase.
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE where possible).

-- ─────────────────────────────────────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name_ro    text not null,
  name_en    text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Articles
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  status        text not null default 'draft' check (status in ('draft','published')),
  category_id   uuid references public.categories(id) on delete set null,
  read_minutes  int  not null default 5,
  title_ro      text not null default '',
  title_en      text not null default '',
  excerpt_ro    text not null default '',
  excerpt_en    text not null default '',
  body_ro       text not null default '',   -- rich text stored as HTML
  body_en       text not null default '',
  cover_url     text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_status_idx       on public.articles (status);
create index if not exists articles_category_idx      on public.articles (category_id);
create index if not exists articles_published_at_idx  on public.articles (published_at desc);

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-Level Security
--   • Anyone (anon) can read PUBLISHED articles and all categories.
--   • Any authenticated user (the admin) can do everything.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.articles   enable row level security;
alter table public.categories enable row level security;

-- Articles: public can read published only
drop policy if exists "articles read published" on public.articles;
create policy "articles read published"
  on public.articles for select
  using (status = 'published');

-- Articles: authenticated admin full access
drop policy if exists "articles admin all" on public.articles;
create policy "articles admin all"
  on public.articles for all
  to authenticated
  using (true) with check (true);

-- Categories: public read
drop policy if exists "categories read all" on public.categories;
create policy "categories read all"
  on public.categories for select
  using (true);

-- Categories: authenticated admin full access
drop policy if exists "categories admin all" on public.categories;
create policy "categories admin all"
  on public.categories for all
  to authenticated
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed a couple of categories (optional — edit/remove as you like)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.categories (slug, name_ro, name_en) values
  ('anxietate',  'Anxietate',           'Anxiety'),
  ('cariera',    'Carieră',             'Career'),
  ('relatii',    'Relații',             'Relationships'),
  ('dezvoltare', 'Dezvoltare personală','Personal development')
on conflict (slug) do nothing;
