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

/** Upload an image file and return its public URL + path. */
export async function uploadMedia(file: File): Promise<MediaItem> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const path = `${Date.now()}-${safe || "image"}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw error;
  return { name: path, url: publicUrl(path), createdAt: new Date().toISOString() };
}

export async function deleteMedia(path: string): Promise<void> {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}
