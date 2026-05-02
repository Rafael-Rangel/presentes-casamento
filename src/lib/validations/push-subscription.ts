import { z } from "zod";

/** Corpo JSON do objeto PushSubscription do browser. */
export const pushSubscriptionBodySchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type PushSubscriptionBody = z.infer<typeof pushSubscriptionBodySchema>;

export const pushUnsubscribeBodySchema = z.object({
  endpoint: z.string().url(),
});
