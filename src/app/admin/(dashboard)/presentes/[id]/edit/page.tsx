import { createClient } from "@/lib/supabase/server";
import type { Gift } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GiftEditForm } from "../../gift-form";

export default async function AdminEditPresentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const gift = data as Gift;

  return (
    <div className="space-y-8">
      <Link href="/admin/presentes" className="admin-back-link">
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Voltar à lista
      </Link>
      <header>
        <h1 className="admin-page-title">Editar presente</h1>
        <p className="admin-page-sub">
          Atualiza os dados que os convidados veem na lista pública.
        </p>
      </header>
      <GiftEditForm gift={gift} />
    </div>
  );
}
