import { ContaDadosForm } from "./dados-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ContaDadosPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextRaw = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/presentes";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/conta/dados?next=${encodeURIComponent(nextRaw)}`)}`);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone, relationship_note, marketing_opt_in")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-3 py-10">
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error.message}
        </p>
      </main>
    );
  }

  const row = profile as {
    full_name: string;
    phone: string | null;
    relationship_note: string | null;
    marketing_opt_in: boolean | null;
  } | null;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-3 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          Os teus dados
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Ajuda-nos a saber quem és — usa o mesmo email da conta ({user.email}). Estes dados
          aparecem nas reservas para os noivos.
        </p>
      </div>
      <ContaDadosForm
        defaultFullName={row?.full_name ?? ""}
        defaultPhone={row?.phone ?? ""}
        defaultRelationship={row?.relationship_note ?? ""}
        defaultMarketingOptIn={Boolean(row?.marketing_opt_in)}
        nextHref={nextRaw}
      />
      <p className="text-center text-sm text-zinc-500">
        <Link href="/conta" className="underline">
          Minhas reservas
        </Link>
        {" · "}
        <Link href="/presentes" className="underline">
          Lista de presentes
        </Link>
      </p>
    </main>
  );
}
