# Casamento — referência técnica para recriação

Documento **enxuto**: stack, integrações e modelo de dados. Não descreve a implementação ficheiro a ficheiro — serve de base para refazeres o app à tua maneira.

---

## App Next.js (implementação neste repositório)

1. Copia [`.env.example`](.env.example) para `.env.local` e preenche `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, **`SUPABASE_SERVICE_ROLE_KEY`** (Dashboard → *Project Settings* → *API*, chave **secret** / service role), `NEXT_PUBLIC_SITE_URL`, **`ADMIN_PASSWORD`**, **`ADMIN_SESSION_SECRET`** (string longa aleatória, ex. 32 chars).
2. No Supabase: **SQL Editor** → para projeto **novo**, executa [`supabase/schema.sql`](supabase/schema.sql). Se **já tinhas** `gifts` / `reservations` mas o erro diz que falta `guests`, executa só [`supabase/sql_editor_add_guests.sql`](supabase/sql_editor_add_guests.sql) (equivalente à migração [`20260223120000_guests_gift_color.sql`](supabase/migrations/20260223120000_guests_gift_color.sql)). Para expiração automática de reservas, executa também [`20260223140000_expire_reservations.sql`](supabase/migrations/20260223140000_expire_reservations.sql). Para **upload de fotos dos presentes** no painel, executa [`supabase/sql_editor_storage_gift_images.sql`](supabase/sql_editor_storage_gift_images.sql) (bucket público `gift-images`).
3. **Authentication → URL Configuration**: adiciona `http://localhost:3000/auth/callback` (e o equivalente em produção) a **Redirect URLs**.
4. **Painel noivos:** acede a `/admin/login` e usa a `ADMIN_PASSWORD` — não é necessário perfil `admin` no Supabase para gerir presentes/convidados (isso usa a *service role* no servidor). O login **“Entrar (reservar)”** no menu continua a ser **Supabase Auth** para quem quiser reservar presentes com conta.

5. Instala dependências e arranca: `npm install` e `npm run dev`.

Rotas principais: `/` (três entradas), `/presentes` (lista pública), `/convite/[slug]` (convite por convidado), `/admin/login` + `/admin` (painel: convidados, presentes, definições). Reservas: `/login`, `/conta`.

**SMTP (Gmail):** podes usar `smtp.gmail.com` e porta `587` com **palavra-passe de aplicação** — nunca commits essa palavra-passe; se a expuseres, revoga no Google e gera outra.

**Fotos do casal:** estão em [`imagens_casal/`](imagens_casal/) na raiz. O script [`scripts/copy-couple-photos.mjs`](scripts/copy-couple-photos.mjs) copia essa pasta para `public/imagens_casal` antes de `npm run dev` e antes de `npm run build` (`prebuild`). Assim o deploy (ex. Netlify) não depende de symlinks fora de `public/`.

### Deploy na Netlify

1. **New site from Git** → escolhe o repositório. A Netlify deteta **Next.js**; **Build command** `npm run build` (o `prebuild` copia `imagens_casal` → `public/imagens_casal`). **Publish directory**: deixa **vazio** (runtime Next.js/OpenNext).
2. **Environment variables** (Production e, se quiseres, Deploy previews): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (domínio final com `https://` — recomendado mesmo que a Netlify forneça `URL`), `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_WEDDING_DATE` (opcional), SMTP se usares convites por email, e **`CRON_SECRET`** (string longa aleatória).
3. **Cron de reservas:** em produção, a função agendada [`netlify/functions/expire-reservations.mjs`](netlify/functions/expire-reservations.mjs) (ver [`netlify.toml`](netlify.toml)) corre **de hora em hora** e chama [`/api/cron/expire-reservations`](src/app/api/cron/expire-reservations/route.ts) com `Authorization: Bearer <CRON_SECRET>`. As funções agendadas **só correm no deploy de produção** publicado (não em branch previews).
4. Em **Supabase → Authentication → URL Configuration**, adiciona `https://<teu-dominio>/auth/callback` às **Redirect URLs**.

### Supabase CLI (opcional)

Na raiz do repo já existe `supabase/config.toml` (`supabase init`). Para ligar ao projeto alojado:

1. Instala a CLI: [Supabase CLI](https://supabase.com/docs/guides/cli) ou `npx supabase@latest`.
2. `npx supabase login` (abre o browser).
3. `npx supabase link --project-ref nomquqlgbmtbvtepeotz` (substitui pelo teu *project ref*, o subdomínio de `https://REF.supabase.co`). O comando pede a **database password** (Dashboard → *Project Settings* → *Database* — não é a API secret key).

**Nota:** a CLI e `supabase db remote commit` usam sobretudo as chaves **legacy** (`anon` / `service_role` em JWT). As chaves novas (`sb_publishable_` / `sb_secret_`) funcionam na app Next com `createClient`; para a CLI, se algo falhar, usa as chaves do separador **Legacy API Keys** no dashboard.

Se a base **já tiver tabelas** criadas à mão, não corras `schema.sql` outra vez sem rever conflitos. Podes alinhar o estado remoto com `npx supabase db pull` (gera migrações a partir do remoto) ou continuar a gerir o DDL pelo SQL Editor.

---

## Stack sugerida (equivalente ao projeto de referência)

| Camada | Tecnologia |
|--------|------------|
| Framework | **Next.js** (App Router), **React** |
| Estilo | **Tailwind CSS** (v4 no projeto original; podes usar v3/v4 à escolha) |
| Backend-as-a-service | **Supabase** (PostgreSQL + Auth + opcionalmente Storage / Edge Functions) |
| Validação de API | **Zod** (ou equivalente) |
| Imagens | **next/image** + **Sharp** em produção |
| Animações (opcional) | **GSAP** ou só CSS |
| Push web (opcional) | **web-push** + chaves **VAPID** |
| Testes (opcional) | **Vitest** + **Playwright** |

Tipografia usada no original: **Geist** (Google Fonts via `next/font`).

---

## Integração Supabase — padrão de clientes

Três formas típicas de falar com o Supabase num app Next:

1. **Browser** — `@supabase/ssr` `createBrowserClient` com `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respeita RLS com o utilizador logado).
2. **Servidor (RSC, Server Actions, Route Handlers)** — `createServerClient` com cookies da sessão (refresh de tokens, RLS com o utilizador da request).
3. **Servidor privilegiado** — `createClient` de `@supabase/supabase-js` com **`SUPABASE_SERVICE_ROLE_KEY`** (ignora RLS). Usar **só** em código que nunca corra no cliente (API routes, jobs, scripts). Nunca expor no `NEXT_PUBLIC_*`.

**Middleware:** podes proteger rotas (ex. `/admin`) com `supabase.auth.getUser()` e redirecionar quem não tem sessão.

---

## Modelo de dados (PostgreSQL / Supabase)

Conceito do schema de referência (neste repo: [`supabase/schema.sql`](supabase/schema.sql); no documento original referia-se a `web/supabase/schema.sql`):

### `profiles`

- Liga `auth.users` ao perfil da app (`auth_user_id`, `full_name`, `email`).
- `role`: `guest` | `admin` (para autorização na tua app).

### `gifts` (catálogo)

- Campos típicos: título, descrição, preço estimado, categoria, **prioridade** (`essential` | `high` | `normal`), **status** (`available` | `reserved` | `confirmed` | `coming_soon`), mês de “drop” / liberação (`release_month`), caminho ou URL de imagem, loja / URL externa.

### `reservations`

- `gift_id` → `gifts`.
- `user_id` → `profiles` (opcional se reservas forem anónimas ou por convite).
- Mensagem, previsão de compra, comprovante (path), **`expires_at`** (ex. +48h), **`is_surprise`**, **status** (`reserved` | `confirmed` | `expired`).

### Tabelas para evoluir o produto

- **`guest_messages`** — mural / recados (campo `approved` para moderação).
- **`rsvp`** — confirma presença, acompanhantes, restrições alimentares, notas.
- **`push_subscriptions`** — endpoint + chaves `p256dh` / `auth` + `user_id`, `enabled`.

Extensão usada no DDL de referência: **pgcrypto** (para `gen_random_uuid()`).

---

## Row Level Security (RLS) — intenção

No original, RLS está ligado com políticas de exemplo:

- **Presentes:** leitura pública do catálogo (`SELECT` em `gifts` para todos).
- **Reservas:** `SELECT` / `INSERT` condicionados ao utilizador autenticado dono do `profile` (quando quiseres reservas “conta a conta”).
- **Mensagens:** insert público possível; `SELECT` só com `approved = true`.
- **Perfis:** utilizador vê / atualiza só o próprio registo.

**Nota para a tua recriação:** se usares **Route Handler com service role** para reservas sem login, as políticas RLS do cliente anónimo não são o que “segura” a operação — o servidor é que deve validar regras (ex.: um presente só uma reserva ativa, estado `available`, etc.).

---

## Integrações à parte do CRUD básico

### Reserva de presente

Fluxo lógico: validar input → garantir que o presente está `available` → criar linha em `reservations` → atualizar `gifts.status` para `reserved` (ou usar transação / trigger no Postgres para consistência). Invalidar cache ou tag de revalidação se usares cache de lista no Next.

### “Drops” mensais

Ideia: job (cron na Netlify, Supabase **pg_cron**, ou Edge Function agendada) que altera `gifts.status` ou `release_month` consoante a data — no original isto era só um stub.

### Expiração de reservas

Implementado: função SQL `run_expire_stale_reservations()` (ver `schema.sql` / migração `20260223140000`) chamada pela rota `/api/cron/expire-reservations` com **service role**, agendada na **Netlify** via função em `netlify/functions/expire-reservations.mjs` + `netlify.toml`.

### Web Push

- Gerar par de chaves **VAPID**; guardar `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (browser subscreve) e `VAPID_PRIVATE_KEY` (só servidor).
- Cliente: `serviceWorker` + `pushManager.subscribe`.
- Servidor: biblioteca **web-push** para `sendNotification` com o objeto `subscription` guardado (idealmente na tabela `push_subscriptions`).

### PWA

`manifest.json` (nome, cores, `start_url`, ícones). Service worker podes combinar com push.

---

## Variáveis de ambiente (checklist)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=               # ex.: http://localhost:3000 (magic link)
NEXT_PUBLIC_WEDDING_DATE=           # opcional — texto na home
SUPABASE_SERVICE_ROLE_KEY=          # só servidor
CRON_SECRET=                        # Netlify: função agendada + rota /api/cron/*
NEXT_PUBLIC_VAPID_PUBLIC_KEY=       # se usares push
VAPID_PRIVATE_KEY=                  # só servidor
```

Se tiveres painel admin com “senha simples”, **não** uses `NEXT_PUBLIC_*` para segredos — isso vai no bundle do browser.

---

## Funcionalidades de produto (lista de requisitos, alto nível)

- Home com destaque do casamento (data, CTA).
- Lista de presentes com filtros / pesquisa e fluxo de reserva (incl. “surpresa” se quiseres).
- Convite (página geral + convite personalizado por código ou token).
- Área “minha reserva” / conta (depende de Auth e políticas).
- Admin: gestão de catálogo, convidados, RSVPs, etc. — alinhado com `profiles.role` e RLS ou com API privilegiada.
- Opcional: mensagens, RSVP persistido, notificações push, jobs de expiração e de liberação mensal.

---

## Onde está o SQL completo

O DDL e as políticas de exemplo estão em **`supabase/schema.sql`** — executa no projeto Supabase (SQL Editor ou CLI).

---

## Imagens e LGPD

Há fotos do casal no repositório; ao republicares noutro sítio, trata consentimento, direitos de imagem e minimização de dados pessoais nos formulários.
