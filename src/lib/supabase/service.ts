import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Mensagem para mostrar no painel e nas server actions quando falta a service role. */
export const SERVICE_ROLE_CONFIG_MESSAGE =
  "Define NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local (Supabase → Project Settings → API → service_role). Em produção, adiciona-as nas variáveis de ambiente da Vercel.";

export function isSupabaseServiceConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return Boolean(url && key);
}

/** Cliente privilegiado, ou `null` se faltar URL/chave (evita crash nas páginas). */
export function createServiceClientOrNull(): SupabaseClient | null {
  if (!isSupabaseServiceConfigured()) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
  );
}

export type ServiceClientResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; error: string };

/** Para server actions: erro amigável em vez de lançar exceção. */
export function getServiceClientOrError(): ServiceClientResult {
  const supabase = createServiceClientOrNull();
  if (!supabase) {
    return { ok: false, error: SERVICE_ROLE_CONFIG_MESSAGE };
  }
  return { ok: true, supabase };
}

/** Cliente privilegiado — só onde um falha explícito é aceitável (ex.: cron). */
export function createServiceClient(): SupabaseClient {
  const supabase = createServiceClientOrNull();
  if (!supabase) {
    throw new Error(
      "Configuração em falta: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return supabase;
}
