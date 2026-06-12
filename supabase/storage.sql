-- Media storage for the blog (cover images + in-body images).
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run.

-- Public bucket named "media".
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- ── Policies on storage.objects, scoped to the "media" bucket ────────────────
--   • Anyone can READ (so images render on the public blog).
--   • Authenticated admin can upload / update / delete.

drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
