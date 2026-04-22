import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const defaultNext =
    typeof sp.redirect === "string" && sp.redirect.startsWith("/")
      ? sp.redirect
      : "/";

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Iniciar sessão
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Recebes um link por email (magic link). Sem palavra-passe.
        </p>
      </div>
      {sp.error === "auth" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Falha na autenticação. Tenta pedir um novo link.
        </p>
      ) : null}
      <LoginForm defaultNext={defaultNext} />
      <p className="text-center text-sm text-zinc-500">
        <Link href="/" className="underline">
          Voltar à página inicial
        </Link>
      </p>
    </main>
  );
}
