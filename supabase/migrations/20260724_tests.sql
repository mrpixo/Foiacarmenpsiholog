-- Psychological tests: results + newsletter subscribers.
-- Run this in the Supabase SQL editor (or `supabase db push`).
--
-- Both tables have RLS enabled with NO policies, so the anon/authenticated
-- keys can neither read nor write them. All writes go through the `submit-test`
-- Edge Function, which uses the service-role key (bypasses RLS). Reading is
-- for you, via the dashboard / service role.

create table if not exists public.test_result (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null,
  score             integer not null,
  band              text not null,
  locale            text not null default 'ro',
  email             text,                    -- present only if the user asked for their results by email
  marketing_consent boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists test_result_slug_idx on public.test_result (slug);
create index if not exists test_result_created_idx on public.test_result (created_at desc);

create table if not exists public.subscriber (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  source            text not null default 'test',
  marketing_consent boolean not null default true,
  locale            text not null default 'ro',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.test_result enable row level security;
alter table public.subscriber  enable row level security;
-- (No policies on purpose — locked to the service role used by the Edge Function.)
