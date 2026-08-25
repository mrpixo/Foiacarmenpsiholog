-- Cache for the live Google rating shown in the author card.
--
-- A single row (id = 1) is refreshed by the `google-reviews` Edge Function,
-- which is the only writer (service role). RLS is on with no policies, so the
-- anon/public key can neither read nor write it — the function serves the value.

create table if not exists public.google_rating (
  id         int primary key default 1,
  rating     numeric(2,1),
  total      int,
  url        text,
  fetched_at timestamptz,
  constraint google_rating_single_row check (id = 1)
);

alter table public.google_rating enable row level security;
-- No policies on purpose: only the service role (Edge Function) touches this table.
