"use server";

import { ADMIN_COOKIE, signAdminToken } from "@/lib/admin-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";

export type AdminLoginState = { ok: boolean; error?: string };

function safeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ba, bb);
}

function useSecureCookies() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.NETLIFY === "true"
  );
}

export async function loginAdmin(
  _prev: AdminLoginState | null,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected) {
    return {
      ok: false,
      error:
        "Define ADMIN_PASSWORD no .env.local (e ADMIN_SESSION_SECRET) para usar o painel.",
    };
  }

  if (!safeCompare(password, expected)) {
    return { ok: false, error: "Senha incorreta." };
  }

  const token = await signAdminToken(remember);
  const jar = await cookies();
  const secure = useSecureCookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 90 : 60 * 60 * 24,
  });

  const nextRaw = formData.get("redirect");
  const next =
    typeof nextRaw === "string" && nextRaw.startsWith("/admin")
      ? nextRaw
      : "/admin";
  redirect(next);
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  const secure = useSecureCookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}
