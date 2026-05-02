"use client";

import { urlBase64ToUint8Array } from "@/lib/push-client-utils";
import { Bell, BellOff, Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  vapidPublicKey: string | undefined;
};

export function PushNotificationSettings({ vapidPublicKey }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [testPending, setTestPending] = useState(false);

  const refreshSubscriptionState = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);
    setPermission(
      typeof Notification !== "undefined"
        ? Notification.permission
        : "denied",
    );
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      setSubscribed(Boolean(sub));
    } catch {
      setSubscribed(false);
    }
  }, []);

  useEffect(() => {
    void refreshSubscriptionState();
  }, [refreshSubscriptionState]);

  const configurePush = async () => {
    setMessage(null);
    if (!vapidPublicKey?.trim()) {
      setMessage("Notificações push não estão configuradas neste site (faltam chaves VAPID).");
      return;
    }
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setMessage(
          perm === "denied"
            ? "Permissão negada. Nas definições do browser podes permitir notificações para este site."
            : "Permissão não concedida.",
        );
        setLoading(false);
        return;
      }

      const key = urlBase64ToUint8Array(vapidPublicKey.trim());
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key as unknown as BufferSource,
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setMessage(json.error ?? "Não foi possível guardar a subscrição.");
        setLoading(false);
        return;
      }

      setSubscribed(true);
      setMessage("Notificações ativadas neste dispositivo.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erro ao subscrever push.");
    } finally {
      setLoading(false);
    }
  };

  const disablePush = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      const endpoint = sub?.endpoint;
      if (sub) {
        await sub.unsubscribe();
      }
      if (endpoint) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setSubscribed(false);
      setMessage("Notificações desativadas.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erro ao desativar.");
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    setTestPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const json = (await res.json()) as {
        ok?: boolean;
        sent?: number;
        errors?: string[];
      };
      if (!res.ok) {
        setMessage("Não foi possível enviar o teste.");
        return;
      }
      if ((json.sent ?? 0) > 0) {
        setMessage("Enviámos uma notificação de teste.");
      } else {
        setMessage(
          json.errors?.length
            ? json.errors.join(" ")
            : "Nenhum envio (verifica VAPID no servidor ou activa primeiro as notificações).",
        );
      }
    } catch {
      setMessage("Erro ao pedir teste.");
    } finally {
      setTestPending(false);
    }
  };

  if (supported === false) {
    return (
      <div className="rounded-2xl border border-border/90 bg-paper/90 p-4 shadow-sm sm:p-5">
        <h2 className="font-display text-lg font-medium text-ink">
          Notificações no telemóvel
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Este browser não suporta Web Push ou notificações. No iOS, o Safari só
          oferece push limitado (por vezes com a página adicionada ao ecrã
          inicial).
        </p>
      </div>
    );
  }

  if (supported === null) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border/90 bg-paper/90 p-4 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        A carregar…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/90 bg-paper/90 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
          <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-medium text-ink">
            Notificações no telemóvel
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Avisa-te quando há novidades sobre reservas (com o browser fechado, em
            muitos dispositivos). Precisas de permitir notificações quando o
            browser pedir.
          </p>

          {!vapidPublicKey?.trim() ? (
            <p className="mt-3 text-sm text-terracotta">
              Neste ambiente as notificações push ainda não estão configuradas.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {!subscribed ? (
              <button
                type="button"
                disabled={loading || !vapidPublicKey?.trim()}
                onClick={() => void configurePush()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ocean-deep px-4 text-sm font-semibold text-paper shadow-sm transition hover:bg-ocean disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Bell className="h-4 w-4" aria-hidden />
                )}
                Ativar notificações
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void disablePush()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-canvas/50 px-4 text-sm font-medium text-ink transition hover:bg-canvas disabled:opacity-50"
                >
                  <BellOff className="h-4 w-4" aria-hidden />
                  Desativar
                </button>
                <button
                  type="button"
                  disabled={testPending}
                  onClick={() => void sendTest()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ocean/35 bg-ocean/5 px-4 text-sm font-medium text-ocean-deep transition hover:bg-ocean/10 disabled:opacity-50"
                >
                  {testPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden />
                  )}
                  Enviar teste
                </button>
              </>
            )}
          </div>

          {permission === "denied" ? (
            <p className="mt-3 text-xs text-terracotta">
              As notificações estão bloqueadas para este site. Abre as definições
              do browser e permite notificações para voltares a tentar.
            </p>
          ) : null}

          {message ? (
            <p className="mt-3 text-sm text-ink" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
