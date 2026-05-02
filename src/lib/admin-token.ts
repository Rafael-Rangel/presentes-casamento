import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "casamento_admin";

/** Segundos para JWT + cookie quando "lembrar neste aparelho" (evita o limite anterior de 90 dias). */
export const ADMIN_REMEMBER_MAX_AGE_SEC = 60 * 60 * 24 * 365 * 100;

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET em falta ou demasiado curto (mín. 16 caracteres).",
    );
  }
  return new TextEncoder().encode(s);
}

export async function signAdminToken(remember: boolean): Promise<string> {
  const jwt = new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt();
  if (remember) {
    jwt.setExpirationTime(
      Math.floor(Date.now() / 1000) + ADMIN_REMEMBER_MAX_AGE_SEC,
    );
  } else {
    jwt.setExpirationTime("1d");
  }
  return jwt.sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    return false;
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(s));
    return true;
  } catch {
    return false;
  }
}
