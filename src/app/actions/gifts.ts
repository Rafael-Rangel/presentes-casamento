"use server";

import { requireAdminOrRedirect } from "@/lib/require-admin";
import {
  giftImagePathFromPublicUrl,
  removeGiftImageIfInBucket,
  uploadGiftImageFile,
} from "@/lib/supabase/gift-image-storage";
import { getServiceClientOrError } from "@/lib/supabase/service";
import { giftFormSchema } from "@/lib/validations/gift";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";

export type GiftActionState = { ok: boolean; error?: string };

function parseGiftForm(formData: FormData, imageUrlOverride?: string | null) {
  const imageUrlField =
    imageUrlOverride !== undefined
      ? (imageUrlOverride ?? "")
      : String(formData.get("imageUrl") ?? "");

  return giftFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    estimatedPrice: formData.get("estimatedPrice") ?? "",
    category: formData.get("category") ?? "",
    priority: formData.get("priority") ?? "normal",
    status: formData.get("status") ?? "available",
    releaseMonth: formData.get("releaseMonth"),
    imageUrl: imageUrlField,
    storeUrl: formData.get("storeUrl") ?? "",
    accentColor: formData.get("accentColor") ?? "#6366f1",
  });
}

async function resolveImageUrlForForm(
  formData: FormData,
  supabase: Parameters<typeof uploadGiftImageFile>[0],
  uploadFolderId: string,
): Promise<
  { ok: true; imageUrl: string | null } | { ok: false; error: string }
> {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    const up = await uploadGiftImageFile(supabase, file, uploadFolderId);
    if (!up.ok) {
      return { ok: false, error: up.error };
    }
    return { ok: true, imageUrl: up.publicUrl };
  }

  const raw = String(formData.get("imageUrl") ?? "").trim();
  if (!raw) {
    return { ok: true, imageUrl: null };
  }
  try {
    new URL(raw);
  } catch {
    return { ok: false, error: "URL da imagem inválida." };
  }
  return { ok: true, imageUrl: raw };
}

export async function createGift(
  _prev: GiftActionState | null,
  formData: FormData,
): Promise<GiftActionState> {
  await requireAdminOrRedirect();
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }

  const uploadFolder = randomUUID();
  const resolved = await resolveImageUrlForForm(
    formData,
    svc.supabase,
    uploadFolder,
  );
  if (!resolved.ok) {
    return { ok: false, error: resolved.error };
  }

  const parsed = parseGiftForm(formData, resolved.imageUrl);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().formErrors.join("; ") || "Dados inválidos",
    };
  }
  const v = parsed.data;

  const { error } = await svc.supabase.from("gifts").insert({
    title: v.title,
    description: v.description,
    estimated_price: v.estimatedPrice,
    category: v.category,
    priority: v.priority,
    status: v.status,
    release_month: v.releaseMonth,
    image_url: v.imageUrl,
    store_url: v.storeUrl,
    accent_color: v.accentColor,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
  return { ok: true };
}

export async function updateGift(
  giftId: string,
  _prev: GiftActionState | null,
  formData: FormData,
): Promise<GiftActionState> {
  await requireAdminOrRedirect();
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }

  const { data: existing, error: fetchErr } = await svc.supabase
    .from("gifts")
    .select("image_url")
    .eq("id", giftId)
    .maybeSingle();

  if (fetchErr || !existing) {
    return { ok: false, error: fetchErr?.message ?? "Presente não encontrado." };
  }

  const oldUrl = existing.image_url as string | null;

  const resolved = await resolveImageUrlForForm(
    formData,
    svc.supabase,
    giftId,
  );
  if (!resolved.ok) {
    return { ok: false, error: resolved.error };
  }

  const parsed = parseGiftForm(formData, resolved.imageUrl);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.flatten().formErrors.join("; ") || "Dados inválidos",
    };
  }
  const v = parsed.data;
  const newUrl = v.imageUrl;

  const { error } = await svc.supabase
    .from("gifts")
    .update({
      title: v.title,
      description: v.description,
      estimated_price: v.estimatedPrice,
      category: v.category,
      priority: v.priority,
      status: v.status,
      release_month: v.releaseMonth,
      image_url: newUrl,
      store_url: v.storeUrl,
      accent_color: v.accentColor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftId);

  if (error) {
    return { ok: false, error: error.message };
  }

  if (
    oldUrl &&
    oldUrl !== newUrl &&
    giftImagePathFromPublicUrl(oldUrl)
  ) {
    await removeGiftImageIfInBucket(svc.supabase, oldUrl);
  }

  revalidatePath("/presentes");
  revalidatePath(`/presentes/${giftId}`);
  revalidatePath("/admin/presentes");
  return { ok: true };
}

export async function deleteGiftForm(
  _prev: GiftActionState | null,
  formData: FormData,
): Promise<GiftActionState> {
  await requireAdminOrRedirect();
  const id = formData.get("giftId");
  if (typeof id !== "string" || !id) {
    return { ok: false, error: "ID inválido" };
  }
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }

  const { data: row } = await svc.supabase
    .from("gifts")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await svc.supabase.from("gifts").delete().eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }

  if (row?.image_url) {
    await removeGiftImageIfInBucket(svc.supabase, row.image_url as string);
  }

  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
  redirect("/admin/presentes");
}

export async function deleteGift(giftId: string): Promise<GiftActionState> {
  await requireAdminOrRedirect();
  const svc = getServiceClientOrError();
  if (!svc.ok) {
    return { ok: false, error: svc.error };
  }

  const { data: row } = await svc.supabase
    .from("gifts")
    .select("image_url")
    .eq("id", giftId)
    .maybeSingle();

  const { error } = await svc.supabase.from("gifts").delete().eq("id", giftId);
  if (error) {
    return { ok: false, error: error.message };
  }

  if (row?.image_url) {
    await removeGiftImageIfInBucket(svc.supabase, row.image_url as string);
  }

  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
  return { ok: true };
}
