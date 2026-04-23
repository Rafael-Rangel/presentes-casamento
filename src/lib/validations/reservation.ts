import { z } from "zod";

export const reserveGiftSchema = z.object({
  giftId: z.string().uuid(),
  message: z.string().max(2000).default(""),
  /** `YYYY-MM-DD` do input date — enviado assim ao Postgres (sem deslocar fuso). */
  purchaseEstimate: z
    .union([z.string(), z.undefined()])
    .optional()
    .transform((s) => {
      if (typeof s !== "string") return undefined;
      const t = s.trim();
      if (!t) return undefined;
      return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : undefined;
    }),
  isSurprise: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

export type ReserveGiftInput = z.infer<typeof reserveGiftSchema>;
