import { z } from "zod";

export const guestFormSchema = z
  .object({
    displayName: z.string().min(1, "Nome obrigatório").max(120),
    email: z.string().max(200).optional().default(""),
    phone: z.string().max(40).optional().default(""),
    notes: z.string().max(2000).optional().default(""),
  })
  .superRefine((val, ctx) => {
    const e = val.email.trim();
    if (e && !z.string().email().safeParse(e).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email inválido",
        path: ["email"],
      });
    }
  })
  .transform((val) => ({
    displayName: val.displayName.trim(),
    email: val.email.trim() === "" ? null : val.email.trim(),
    phone: val.phone.trim() === "" ? null : val.phone.trim(),
    notes: val.notes,
  }));
