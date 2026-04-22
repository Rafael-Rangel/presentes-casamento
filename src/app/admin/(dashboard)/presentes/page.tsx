import { giftStatusLabel } from "@/components/gift-status-label";
import { createClient } from "@/lib/supabase/server";
import type { Gift } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DeleteGiftForm } from "./delete-form";

export default async function AdminPresentesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .order("created_at", { ascending: false });

  const gifts = (data ?? []) as Gift[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <header>
          <h1 className="admin-page-title">Presentes</h1>
          <p className="admin-page-sub">
            Catálogo visível em <strong className="text-ink">/presentes</strong>
            . Edita estados, imagens e datas de liberação aqui.
          </p>
        </header>
        <Link href="/admin/presentes/new" className="admin-btn-primary shrink-0">
          <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.25} aria-hidden />
          Novo presente
        </Link>
      </div>

      {error ? (
        <p className="rounded-2xl border border-terracotta/30 bg-paper px-4 py-3 text-sm text-terracotta">
          {error.message}
        </p>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Categoria</th>
              <th className="w-[180px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((g) => (
              <tr key={g.id}>
                <td className="font-medium text-ink">{g.title}</td>
                <td>
                  <span className="inline-flex rounded-full border border-border/80 bg-canvas/60 px-2.5 py-0.5 text-xs font-medium text-muted">
                    {giftStatusLabel(g.status)}
                  </span>
                </td>
                <td className="text-muted">{g.category || "—"}</td>
                <td>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/admin/presentes/${g.id}/edit`}
                      className="admin-btn-link text-xs"
                    >
                      Editar
                    </Link>
                    <DeleteGiftForm giftId={g.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gifts.length === 0 && !error ? (
        <p className="rounded-2xl border border-dashed border-border bg-paper/50 px-4 py-10 text-center text-sm text-muted">
          Sem presentes ainda. Cria o primeiro com &quot;Novo presente&quot;.
        </p>
      ) : null}
    </div>
  );
}
