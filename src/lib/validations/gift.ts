import { z } from "zod";

const priorityEnum = z.enum(["essential", "high", "normal"]);
const statusEnum = z.enum([
  "available",
  "reserved",
  "confirmed",
  "coming_soon",
]);

function optionalUrl(field: string) {
  return z
    .string()
    .max(2000)
    .optional()
    .default("")
    .superRefine((val, ctx) => {
      const t = val.trim();
      if (!t) return;
      try {
        new URL(t);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field}: URL inválida`,
        });
      }
    })
    .transform((s) => {
      const t = s.trim();
      return t === "" ? null : t;
    });
}

export const giftFormSchema = z.object({
  title: z.string().min(1, "Título obrigatório").max(200),
  description: z.string().max(5000).optional().default(""),
  estimatedPrice: z
    .string()
    .optional()
    .default("")
    .transform((s) => {
      const t = s.trim();
      if (t === "") return null;
      const n = Number(t);
      return Number.isFinite(n) ? n : NaN;
    })
    .refine((n) => n === null || !Number.isNaN(n), "Preço inválido"),
  category: z.string().max(100).optional().default(""),
  priority: priorityEnum.default("normal"),
  status: statusEnum.default("available"),
  /** `YYYY-MM` já normalizado (vem do `<input type="date">` no servidor). */
  releaseMonth: z
    .union([z.string(), z.null()])
    .optional()
    .transform((s) => {
      if (s === undefined || s === null) return null;
      const t = typeof s === "string" ? s.trim() : "";
      if (!t) return null;
      return /^\d{4}-\d{2}$/.test(t) ? t : null;
    }),
  imageUrl: optionalUrl("Imagem"),
  storeUrl: optionalUrl("Loja"),
  accentColor: z
    .string()
    .max(32)
    .default("#6366f1")
    .transform((s) => s.trim() || "#6366f1")
    .refine(
      (s) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s),
      "Cor inválida (usa hex, ex. #e11d48)",
    ),
});

export type GiftFormInput = z.infer<typeof giftFormSchema>;
