import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "casamento_admin";

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
  const exp = remember ? "90d" : "1d";
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecret());
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
