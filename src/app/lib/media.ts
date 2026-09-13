import { supabase } from "./supabase";

export const MEDIA_BUCKET = "media";

export type MediaItem = {
  name: string; // path within the bucket
  url: string; // public URL
  createdAt: string | null;
};

function publicUrl(path: string): string {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** List uploaded images, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => f.id !== null) // skip folder placeholders
    .map((f) => ({
      name: f.name,
      url: publicUrl(f.name),
      createdAt: (f.created_at as string | undefined) ?? null,
    }));
}

/**
 * Re-encode an image as compressed WebP (max 1600px wide) so multi-MB camera
 * shots never land on the site as-is. SVG/GIF pass through (vector / possible
 * animation), and any file the browser can't decode falls back to the original.
 */
async function toWebp(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const original = { blob: file as Blob, ext, type: file.type };
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return original;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bmp.width);
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
    if (!blob || blob.size >= file.size) return original; // keep whichever is smaller
    return { blob, ext: "webp", type: "image/webp" };
  } catch {
    return original;
  }
}

/** Upload an image file (converted to WebP when smaller) and return its public URL + path. */
export async function uploadMedia(file: File): Promise<MediaItem> {
  const { blob, ext, type } = await toWebp(file);
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const path = `${Date.now()}-${safe || "image"}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { cacheControl: "31536000", upsert: false, contentType: type });
  if (error) throw error;
  return { name: path, url: publicUrl(path), createdAt: new Date().toISOString() };
}

export async function deleteMedia(path: string): Promise<void> {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}
