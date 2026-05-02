import { createServiceClient } from "@/lib/supabase/service";
import webpush from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

let vapidConfigured = false;

function ensureVapid(): boolean {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const priv = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!pub || !priv) return false;
  const subject =
    process.env.VAPID_SUBJECT?.trim() ||
    (process.env.EMAIL_FROM?.trim()
      ? `mailto:${process.env.EMAIL_FROM.trim()}`
      : "mailto:noreply@localhost");
  webpush.setVapidDetails(subject, pub, priv);
  vapidConfigured = true;
  return true;
}

/** Indica se envio push está configurado (env). */
export function isPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() &&
      process.env.VAPID_PRIVATE_KEY?.trim(),
  );
}

/**
 * Envia notificação push a todos os dispositivos subscritos do perfil.
 * Usa service role para ler subscrições e remover endpoints expirados (410).
 */
export async function sendPushToProfile(
  profileId: string,
  payload: PushPayload,
): Promise<{ sent: number; errors: string[] }> {
  const errors: string[] = [];
  if (!ensureVapid()) {
    return { sent: 0, errors: ["VAPID não configurado"] };
  }

  const supabase = createServiceClient();
  const { data: rows, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("profile_id", profileId);

  if (error) {
    return { sent: 0, errors: [error.message] };
  }

  const list = rows ?? [];
  let sent = 0;
  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/conta",
    tag: payload.tag,
  });

  for (const row of list) {
    const subscription = {
      endpoint: row.endpoint as string,
      keys: {
        p256dh: row.p256dh as string,
        auth: row.auth as string,
      },
    };

    try {
      await webpush.sendNotification(subscription, body, {
        TTL: 86_400,
        urgency: "normal",
      });
      sent++;
    } catch (e: unknown) {
      const status = typeof e === "object" && e !== null && "statusCode" in e ? (e as { statusCode?: number }).statusCode : undefined;
      if (status === 410 || status === 404) {
        await supabase.from("push_subscriptions").delete().eq("id", row.id as string);
      } else {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(msg);
      }
    }
  }

  return { sent, errors };
}

/** Não propaga erro — para usar em server actions após reserva. */
export async function sendPushToProfileSafe(
  profileId: string,
  payload: PushPayload,
): Promise<void> {
  try {
    await sendPushToProfile(profileId, payload);
  } catch (e) {
    console.warn("[push]", e);
  }
}
