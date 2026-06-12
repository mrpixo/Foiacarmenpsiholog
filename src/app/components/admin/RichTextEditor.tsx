import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImagePlus,
  Images,
  Film,
  Undo,
  Redo,
} from "lucide-react";
import { buildExtensions, toEmbedUrl } from "../editor/extensions";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Opens the media library and resolves to a picked image URL (or null). */
  onPickImage?: () => Promise<string | null>;
  /** Opens the media library in multi-select mode for a carousel (or null). */
  onPickImages?: () => Promise<string[] | null>;
  /** Show the YouTube/Vimeo video-embed button. */
  enableVideo?: boolean;
};

export function RichTextEditor({ value, onChange, placeholder, onPickImage, onPickImages, enableVideo }: Props) {
  const editor = useEditor({
    extensions: buildExtensions({ placeholder }),
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "blog-prose min-h-[260px] px-4 py-3" } },
  });

  // Sync external value changes (e.g. switching language tab) into the editor.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = async () => {
    if (!onPickImage) return;
    const url = await onPickImage();
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertCarousel = async () => {
    if (!onPickImages) return;
    const urls = await onPickImages();
    if (urls && urls.length > 0) {
      editor.chain().focus().insertContent({ type: "carousel", attrs: { images: urls } }).run();
    }
  };

  const insertVideo = () => {
    const url = window.prompt("YouTube / Vimeo URL");
    if (!url) return;
    const embed = toEmbedUrl(url.trim());
    if (!embed) {
      alert("Acceptăm doar linkuri YouTube sau Vimeo. / Only YouTube or Vimeo links are supported.");
      return;
    }
    editor.chain().focus().insertContent({ type: "videoEmbed", attrs: { src: embed } }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#e4dcd3] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e4dcd3] bg-[#faf6f2] px-2 py-1.5">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={16} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 size={16} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon size={16} /></ToolbarBtn>
        {onPickImage && (
          <ToolbarBtn onClick={insertImage} title="Image"><ImagePlus size={16} /></ToolbarBtn>
        )}
        {onPickImages && (
          <ToolbarBtn onClick={insertCarousel} title="Image carousel"><Images size={16} /></ToolbarBtn>
        )}
        {enableVideo && (
          <ToolbarBtn onClick={insertVideo} title="Video (YouTube / Vimeo)"><Film size={16} /></ToolbarBtn>
        )}
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={16} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={16} /></ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors",
        active ? "bg-[#006960] text-white" : "text-[#5c554d] hover:bg-[#006960]/10 hover:text-[#006960]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-[#e4dcd3]" />;
}
