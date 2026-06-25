#!/usr/bin/env bash
#
# One-time EC2 setup: PHP-FPM + Apache vhost so /api/v1/* serves JSON from
# the repo's api/ tree (News, Careers, health) instead of the SPA index.html.
#
# Run on the EC2 instance (Amazon Linux 2023), from anywhere:
#   bash /var/www/crayhill2026/scripts/setup-api-ec2.sh
#
# Prerequisites:
#   - httpd already installed and serving the SPA from /var/www/crayhill
#   - Repo cloned at CRAYHILL_REPO (default /var/www/crayhill2026)
#   - .config/secrets.env provisioned on the box with production DB_* values
#   - RDS security group allows inbound 3306 from this EC2 instance

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRAYHILL_REPO="${CRAYHILL_REPO:-$REPO_ROOT}"
DOCROOT="${CRAYHILL_DOCROOT:-/var/www/crayhill}"
CONF_SRC="$REPO_ROOT/config/httpd/crayhill.conf"
CONF_DEST="/etc/httpd/conf.d/crayhill.conf"
SECRETS_FILE="$CRAYHILL_REPO/.config/secrets.env"
CONFIG_DIR="$CRAYHILL_REPO/.config"

echo "==> installing PHP-FPM and MySQL PDO extension"
sudo dnf install -y php-fpm php-mysqlnd php-cli

echo "==> enabling php-fpm and httpd"
sudo systemctl enable --now php-fpm

if [ ! -f "$SECRETS_FILE" ]; then
  echo "ERROR: $SECRETS_FILE not found." >&2
  echo "Provision secrets on the box before running this script (see INSTALL.md)." >&2
  exit 1
fi

echo "==> allowing apache (php-fpm) to read secrets"
# PHP-FPM runs as apache. realpath() needs execute on every parent directory,
# not just read on the file — a 700 .config/ dir causes HTTP 500 even when
# secrets.env is group-readable.
sudo chgrp apache "$CONFIG_DIR"
sudo chmod 750 "$CONFIG_DIR"
sudo chown "$(whoami):apache" "$SECRETS_FILE"
sudo chmod 640 "$SECRETS_FILE"

PHP_FPM_SOCKET="${PHP_FPM_SOCKET:-}"
if [ -z "$PHP_FPM_SOCKET" ] && [ -f /etc/php-fpm.d/www.conf ]; then
  PHP_FPM_SOCKET="$(grep -E '^\s*listen\s*=' /etc/php-fpm.d/www.conf | head -1 | sed -E 's/^[[:space:]]*listen[[:space:]]*=[[:space:]]*//' | tr -d ' ')"
fi
PHP_FPM_SOCKET="${PHP_FPM_SOCKET:-/run/php-fpm/www.sock}"

if [ ! -S "$PHP_FPM_SOCKET" ]; then
  echo "ERROR: PHP-FPM socket not found at $PHP_FPM_SOCKET." >&2
  echo "Check: ls -la /run/php-fpm/  and  grep listen /etc/php-fpm.d/www.conf" >&2
  exit 1
fi
echo "    PHP-FPM socket: $PHP_FPM_SOCKET"

echo "==> verifying env loader as apache user"
if ! sudo -u apache php -r "require '$CRAYHILL_REPO/api/lib/env.php'; echo env('APP_ENV', 'unknown'), PHP_EOL;"; then
  echo "ERROR: apache user cannot load .config/secrets.env (see above)." >&2
  echo "Fix permissions/SELinux on $CONFIG_DIR and retry." >&2
  exit 1
fi

echo "==> installing Apache vhost ($CONF_DEST)"
if [ ! -f "$CONF_SRC" ]; then
  echo "ERROR: missing $CONF_SRC — pull the latest repo and retry." >&2
  exit 1
fi
sed -e "s|@CRAYHILL_REPO@|$CRAYHILL_REPO|g" \
    -e "s|@PHP_FPM_SOCKET@|$PHP_FPM_SOCKET|g" \
    "$CONF_SRC" | sudo tee "$CONF_DEST" >/dev/null

if command -v getenforce >/dev/null 2>&1 && [ "$(getenforce)" = "Enforcing" ]; then
  echo "==> SELinux: label api tree and secrets for httpd"
  sudo chcon -R -t httpd_sys_content_t "$CRAYHILL_REPO/api"
  sudo chcon -R -t httpd_sys_content_t "$CONFIG_DIR"
fi

echo "==> validating Apache config"
sudo apachectl configtest

echo "==> reloading services"
sudo systemctl reload php-fpm
sudo systemctl reload httpd

echo "==> smoke test (API must return JSON, not HTML)"
HEALTH_CODE="$(curl -s -o /tmp/crayhill-health.json -w '%{http_code}' http://localhost/api/v1/health || true)"
HEALTH_CT="$(curl -sI http://localhost/api/v1/health | awk 'tolower($1)=="content-type:" {print $2}' | tr -d '\r')"

echo "    GET /api/v1/health -> HTTP $HEALTH_CODE (Content-Type: ${HEALTH_CT:-unknown})"
if [ "$HEALTH_CODE" != "200" ]; then
  echo "WARNING: health endpoint did not return 200. Recent errors:" >&2
  sudo tail -20 /var/log/httpd/crayhill_error.log 2>/dev/null || true
  if [ -f /var/log/php-fpm/error.log ]; then
    sudo tail -20 /var/log/php-fpm/error.log 2>/dev/null || true
  else
    sudo journalctl -u php-fpm -n 20 --no-pager 2>/dev/null || true
  fi
  exit 1
fi

if ! grep -q '"database"' /tmp/crayhill-health.json 2>/dev/null; then
  echo "WARNING: /api/v1/health did not return JSON (likely still hitting SPA FallbackResource)." >&2
  exit 1
fi

echo "    response: $(head -c 200 /tmp/crayhill-health.json)"
echo ""
echo "API setup complete. News & Careers pages should now load from RDS."
echo "Re-run is safe; it refreshes the vhost and reloads services."
