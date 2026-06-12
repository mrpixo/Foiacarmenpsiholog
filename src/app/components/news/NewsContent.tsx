import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions } from "../editor/extensions";

/**
 * Read-only renderer for news bodies. Uses TipTap (editable: false) so custom
 * nodes — the image carousel and video embeds — render interactively, rather
 * than as static HTML.
 */
export function NewsContent({ html }: { html: string }) {
  const editor = useEditor(
    {
      editable: false,
      extensions: buildExtensions(),
      content: html || "",
    },
    [html],
  );

  if (!editor) return null;
  return <EditorContent editor={editor} className="blog-prose" />;
}
