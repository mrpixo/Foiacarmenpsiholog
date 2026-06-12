import { Node, mergeAttributes, type Extensions } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Convert a YouTube/Vimeo watch URL into an embeddable player URL. */
export function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

// ── Video embed node ─────────────────────────────────────────────────────────
function VideoView({ node }: { node: { attrs: { src: string | null } } }) {
  const src = node.attrs.src;
  return (
    <NodeViewWrapper className="video-embed">
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        {src && (
          <iframe
            src={src}
            title="video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: "1rem" }}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-src"),
        renderHTML: (attrs) => ({ "data-src": attrs.src }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-video]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-video": "" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

// ── Image carousel node ──────────────────────────────────────────────────────
function CarouselView({ node }: { node: { attrs: { images: string[] } } }) {
  const images: string[] = Array.isArray(node.attrs.images) ? node.attrs.images : [];
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <NodeViewWrapper className="carousel-node" />;

  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <NodeViewWrapper className="carousel-node">
      <div className="carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <div className="carousel-slide" key={i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className="carousel-btn left" onClick={() => go(-1)} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="carousel-btn right" onClick={() => go(1)} aria-label="Next">
              <ChevronRight size={20} />
            </button>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={i === index ? "active" : ""}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const Carousel = Node.create({
  name: "carousel",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (el) => {
          try {
            return JSON.parse((el as HTMLElement).getAttribute("data-images") || "[]");
          } catch {
            return [];
          }
        },
        renderHTML: (attrs) => ({ "data-images": JSON.stringify(attrs.images || []) }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-carousel]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-carousel": "" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CarouselView);
  },
});

/** Build the TipTap extension set shared by the editor and the read-only renderer. */
export function buildExtensions(opts: { placeholder?: string } = {}): Extensions {
  return [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    Image.configure({ HTMLAttributes: { class: "rounded-2xl" } }),
    VideoEmbed,
    Carousel,
    Placeholder.configure({ placeholder: opts.placeholder ?? "" }),
  ];
}
