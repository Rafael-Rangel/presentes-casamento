/* global self, clients */
/**
 * Service worker para Web Push — estático em /sw.js
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    try {
      data = { body: event.data?.text() ?? "" };
    } catch {
      data = {};
    }
  }

  const title = data.title ?? "Lista de presentes";
  const body = data.body ?? "Tens uma nova mensagem.";
  const url = typeof data.url === "string" ? data.url : "/conta";

  const options = {
    body,
    icon: "/il_794xN.6027018536_72v0.avif",
    badge: "/il_794xN.6027018536_72v0.avif",
    data: { url },
    tag: data.tag ?? "casamento-default",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = event.notification.data?.url ?? "/conta";
  const absolute = new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === absolute && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(absolute);
      }
      return undefined;
    }),
  );
});
