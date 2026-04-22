import type { SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

export const GIFT_IMAGES_BUCKET = "gift-images";

const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extForMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

/** Extrai o path no bucket a partir da URL pública do Supabase Storage. */
export function giftImagePathFromPublicUrl(
  publicUrl: string | null | undefined,
): string | null {
  if (!publicUrl) return null;
  const marker = `/object/public/${GIFT_IMAGES_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(publicUrl.slice(i + marker.length));
}

export async function removeGiftImageIfInBucket(
  supabase: SupabaseClient,
  publicUrl: string | null | undefined,
): Promise<void> {
  const path = giftImagePathFromPublicUrl(publicUrl);
  if (!path) return;
  await supabase.storage.from(GIFT_IMAGES_BUCKET).remove([path]);
}

export async function uploadGiftImageFile(
  supabase: SupabaseClient,
  file: File,
  folderId: string,
): Promise<{ ok: true; publicUrl: string } | { ok: false; error: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error:
        "Imagem: usa JPEG, PNG, WebP ou GIF.",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Imagem demasiado grande (máx. 4 MB)." };
  }

  const suffix = randomBytes(6).toString("hex");
  const ext = extForMime(file.type);
  const path = `${folderId}/${Date.now()}-${suffix}.${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(GIFT_IMAGES_BUCKET)
    .upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("Bucket not found") || error.message.includes("not found")
          ? "Bucket «gift-images» não existe no Supabase. Corre o SQL em supabase/sql_editor_storage_gift_images.sql"
          : error.message,
    };
  }

  const { data } = supabase.storage
    .from(GIFT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return { ok: true, publicUrl: data.publicUrl };
}
