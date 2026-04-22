import {
  SERVICE_ROLE_CONFIG_MESSAGE,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/service";
import { AlertTriangle } from "lucide-react";

export function AdminServiceRoleBanner() {
  if (isSupabaseServiceConfigured()) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-8 flex gap-3 rounded-2xl border border-terracotta/35 bg-gradient-to-br from-paper via-paper to-canvas/80 px-4 py-4 text-sm text-ink shadow-sm ring-1 ring-terracotta/10"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
        <AlertTriangle className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-display text-base font-medium text-ink">
          Configuração incompleta
        </p>
        <p className="mt-1.5 leading-relaxed text-muted">
          {SERVICE_ROLE_CONFIG_MESSAGE}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Sem a <strong className="text-ink">service role</strong>, o painel não
          consegue gerir a tabela{" "}
          <code className="rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[0.7rem] text-ocean-deep">
            guests
          </code>{" "}
          nem gravar presentes nas ações do servidor.
        </p>
      </div>
    </div>
  );
}
