import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { GiftCreateForm } from "../gift-form";

export default function AdminNovoPresentePage() {
  return (
    <div className="space-y-8">
      <Link href="/admin/presentes" className="admin-back-link">
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Voltar à lista
      </Link>
      <header>
        <h1 className="admin-page-title">Novo presente</h1>
        <p className="admin-page-sub">
          Preenche os campos — o cartão aparece na lista conforme o estado e o
          mês de liberação.
        </p>
      </header>
      <GiftCreateForm />
    </div>
  );
}
