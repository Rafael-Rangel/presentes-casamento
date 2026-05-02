import { z } from "zod";

export const guestProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Indica o teu nome.").max(200),
  phone: z.string().trim().min(3, "Indica um telefone.").max(40),
  relationshipNote: z
    .string()
    .trim()
    .min(1, "Indica como conheces os noivos.")
    .max(500),
  marketingOptIn: z
    .union([z.literal("on"), z.literal(""), z.undefined()])
    .transform((v) => v === "on"),
});

export type GuestProfileInput = z.infer<typeof guestProfileSchema>;
