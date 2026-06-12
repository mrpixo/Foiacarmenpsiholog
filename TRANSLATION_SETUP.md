# Auto-translation setup (DeepL + Supabase Edge Function)

Blog articles are bilingual. You only need to write each post in **one**
language (RO or EN) — when you **Publish**, the empty language is filled
automatically by **DeepL**, preserving the rich-text formatting.

The DeepL API key is held server-side as a Supabase secret (never in the
browser), inside a Supabase **Edge Function** called `translate`.

## One-time setup

1. **Get a DeepL API key** (free): https://www.deepl.com/pro-api → sign up for
   the **API Free** plan (500,000 chars/month). Copy your **Authentication Key**.
   - Free-tier keys end with `:fx` — the function detects this automatically and
     uses the correct DeepL endpoint.

2. **Install the Supabase CLI** (if you don't have it):
   https://supabase.com/docs/guides/cli — e.g. `brew install supabase/tap/supabase`.

3. **Link the project** (run in the repo root, one time):
   ```
   supabase login
   supabase link --project-ref odwtgplhgfzcgjsronqq
   ```

4. **Set the DeepL secret:**
   ```
   supabase secrets set DEEPL_API_KEY=your-deepl-key:fx
   ```

5. **Deploy the function:**
   ```
   supabase functions deploy translate
   ```

That's it. The function lives in `supabase/functions/translate/index.ts`.

## How it works for the admin

- Write the article in either Romanian **or** English (you can leave the other
  language's tabs empty).
- Click **Publish**. The button shows "Translating…" while DeepL fills the empty
  language (title, excerpt, body), then the article is saved + published in both.
- If you fill **both** languages yourself, no translation happens.
- **Save draft** never translates — only **Publish** does.

## Notes

- Only the logged-in admin can call the function (it requires a valid Supabase
  auth token — `verify_jwt` is on by default).
- If the function isn't deployed or the key is missing, publishing a
  single-language article shows an error instead of publishing. Deploy the
  function (steps above) to resolve it. (Articles where you filled both
  languages still publish fine without the function.)
- To re-translate after editing, clear the target language's fields and publish
  again, or just edit that language by hand.
