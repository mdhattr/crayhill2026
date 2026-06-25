#!/usr/bin/env bash
#
# Local PHP API dev server. Run alongside `npm run dev` in frontend/.
#
# Vite proxies /api/v1/<name> -> http://127.0.0.1:8000/v1/<name>.php (see
# frontend/vite.config.ts). This script starts that PHP server.
#
# Requires .config/secrets.env with valid DB_* values and RDS reachable from
# your machine (see INSTALL.md -> "AWS RDS access for local development").

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PHP_BIN="${PHP_BIN:-php}"
if ! command -v "$PHP_BIN" >/dev/null 2>&1; then
  echo "php not found. On macOS with Homebrew keg-only php@8.3:" >&2
  echo '  export PATH="/opt/homebrew/opt/php@8.3/bin:$PATH"' >&2
  exit 1
fi

if [ ! -r "$REPO_ROOT/.config/secrets.env" ]; then
  echo "Missing $REPO_ROOT/.config/secrets.env" >&2
  echo "  cp .config/secrets.env.example .config/secrets.env  # then fill in DB_*" >&2
  exit 1
fi

HOST="${CRAYHILL_API_HOST:-127.0.0.1}"
PORT="${CRAYHILL_API_PORT:-8000}"

echo "PHP API listening on http://${HOST}:${PORT}/v1/<name>.php"
echo "Vite dev server proxies /api/v1/<name> here — keep this running with npm run dev."
exec "$PHP_BIN" -S "${HOST}:${PORT}" -t "$REPO_ROOT/api"
