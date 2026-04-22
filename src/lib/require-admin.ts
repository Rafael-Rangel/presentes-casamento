import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdminOrRedirect(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }
}
