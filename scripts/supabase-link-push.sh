#!/usr/bin/env bash
# Liga o diretório ao projeto remoto e aplica migrações (equivale ao schema + deltas).
# Variáveis (opcional): SUPABASE_PROJECT_REF (default pelo teu .env.local / projeto)
#
# Precisas antes de: npx supabase login
#
# Usage:
#   export SUPABASE_DB_PASSWORD='...'   # Settings → Database (Postgres password)
#   bash scripts/supabase-link-push.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

REF="${SUPABASE_PROJECT_REF:-}"
if [[ -z "${REF}" ]]; then
  echo "Define SUPABASE_PROJECT_REF (subdomínio de PROJECT.supabase.co) ou altera este script." >&2
  exit 1
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  echo "Define SUPABASE_DB_PASSWORD (Dashboard → Settings → Database → password)." >&2
  exit 1
fi

npx supabase link --project-ref "$REF" --password "$SUPABASE_DB_PASSWORD"
echo "✓ Ligado a $REF. A aplicar migrações..."
npx supabase db push
echo "✓ Migrações aplicadas. Opcional: npm run db:remote:seed"
