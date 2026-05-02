"use server";

import {
  ADMIN_COOKIE,
  ADMIN_REMEMBER_MAX_AGE_SEC,
  signAdminToken,
} from "@/lib/admin-token";
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

/** Evita falhas por espaços copiados no painel Netlify / formulário. */
function readAdminPasswordEnv(): string {
  const raw = process.env.ADMIN_PASSWORD;
  return typeof raw === "string" ? raw.trim() : "";
}

function shouldUseSecureCookies() {
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
  const password = String(formData.get("password") ?? "").trim();
  const remember = formData.get("remember") === "on";
  const expected = readAdminPasswordEnv();

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
  const secure = shouldUseSecureCookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: remember ? ADMIN_REMEMBER_MAX_AGE_SEC : 60 * 60 * 24,
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
  const secure = shouldUseSecureCookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}
