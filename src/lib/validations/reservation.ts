import { z } from "zod";

export const reserveGiftSchema = z.object({
  giftId: z.string().uuid(),
  message: z.string().max(2000).default(""),
  purchaseEstimate: z
    .union([z.string(), z.undefined()])
    .optional()
    .transform((s) => {
      if (typeof s !== "string") return undefined;
      const t = s.trim();
      if (!t) return undefined;
      const d = new Date(t);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }),
  isSurprise: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

export type ReserveGiftInput = z.infer<typeof reserveGiftSchema>;
