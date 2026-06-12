import { supabase } from "./supabase";

export type Lang = "ro" | "en";

/** Calls the `translate` edge function (DeepL) to translate plain + html texts. */
export async function translate(args: {
  source: Lang;
  target: Lang;
  plain: string[];
  html: string[];
}): Promise<{ plain: string[]; html: string[] }> {
  const { data, error } = await supabase.functions.invoke("translate", {
    body: {
      source: args.source.toUpperCase(),
      target: args.target.toUpperCase(),
      plain: args.plain,
      html: args.html,
    },
  });
  if (error) {
    // Surface the function's own error message when available.
    const msg = (data as { error?: string })?.error ?? error.message;
    throw new Error(msg);
  }
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as { plain: string[]; html: string[] };
}

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").trim();

/** True if a language side has meaningful content (title or body). */
export function hasContent(title: string, body: string): boolean {
  return Boolean(title.trim() || stripHtml(body));
}
