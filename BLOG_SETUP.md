# Blog + CMS setup (Supabase)

The blog and its admin CMS run on **Supabase** (hosted Postgres + Auth). No
backend server of your own is needed — the site stays static and talks to
Supabase directly from the browser. Access is locked down with Row-Level
Security: the public can read **published** articles only; the admin (a single
authenticated user) can create/edit/publish/unpublish/delete.

## One-time setup

1. **Create a Supabase project** at https://supabase.com (free tier is enough).

2. **Run the schema.** Dashboard → **SQL Editor → New query** → paste the
   contents of `supabase/schema.sql` → **Run**. This creates the `articles` and
   `categories` tables, the RLS policies, and a few starter categories.
   Then run `supabase/storage.sql` the same way — it creates the public
   **`media`** bucket and its access policies (public read; admin upload/delete)
   used by the image media library.
   Also run `supabase/news.sql` — it creates the **`news`** table (for the
   "Ultimele noutăți" section) with the same RLS rules as articles.
   Also run `supabase/cms.sql` — it creates the **`testimonials`** and **`faq`**
   tables (homepage testimonials carousel + FAQ section/page).

3. **Get your API keys.** Dashboard → **Project Settings → API**. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

   Create a `.env` file in the project root (copy `.env.example`) and paste them:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
   Restart the dev server after editing `.env`.
   > The anon key is meant to be public — RLS protects the data. Never put the
   > **service_role** key in the frontend.

4. **Create the admin user.** Dashboard → **Authentication → Users → Add user**
   → enter the therapist's email + a password → create. (Optional but
   recommended: **Authentication → Providers → Email → turn OFF "Enable sign
   ups"** so no one else can register. The admin is full-access once logged in.)

## How it's used

- **Public blog:** `/blog` — lists published articles with **search** (title +
  excerpt + category) and **category filter** (default "Toate / All" shows
  everything). `/blog/<slug>` shows the full article with **related articles**
  from the same category.
- **Admin CMS:** `/admin` — log in with the user from step 4. You get a
  dashboard of all articles (draft + published). Actions:
  - **New article / Edit:** rich text editor with RO + EN tabs (title, excerpt,
    body), **category** (pick or add new), **read time** (manual or "Auto" from
    word count), slug (auto from the RO title), **thumbnail** image.
  - **Media library:** the thumbnail picker and the editor's image button both
    open a media library where you upload images (stored in the Supabase
    `media` bucket) and pick one — for the article thumbnail or to insert into
    the article body.
  - **Save draft:** stored as a draft, not visible to the public.
  - **Publish / Unpublish:** toggles visibility. Unpublishing returns it to
    draft and hides it from the public site.
  - **Delete:** permanently removes the article.

## Bilingual

Each article has a Romanian and an English version (title/excerpt/body). The
blog shows whichever matches the site's RO/EN toggle. Categories are bilingual
too. If you leave one language empty, that language simply shows blank for that
field — fill both for a complete bilingual article.

## Files

- `supabase/schema.sql` — database schema + RLS + seed categories.
- `src/app/lib/supabase.ts` — Supabase client (reads the `.env` vars).
- `src/app/lib/articles.ts` — data access (queries + admin CRUD).
- `src/app/lib/auth.tsx` — admin auth context.
- `src/app/components/blog/*` — public `/blog` + article pages.
- `src/app/components/admin/*` — login, dashboard, editor.

## Deploying

Set the same two `VITE_SUPABASE_*` variables in your host's environment
(Vercel/Netlify project settings, etc.) so the production build can reach
Supabase. Because they're build-time `VITE_` vars, rebuild after setting them.
