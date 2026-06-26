#!/usr/bin/env bash
#
# One-time HTTPS setup on EC2 via Let's Encrypt (certbot).
#
# Run AFTER the domain owner points crayhill.com / www.crayhill.com at this
# instance's public (or Elastic) IP and port 80 is open in the security group.
#
#   bash /var/www/crayhill2026/scripts/setup-ssl-ec2.sh
#
# Prerequisites:
#   - scripts/setup-api-ec2.sh already ran (Apache + PHP API on port 80)
#   - DNS A record for www.crayhill.com (and optionally crayhill.com) → this box
#   - CERTBOT_EMAIL set (Let's Encrypt account / expiry notices)
#
# After success:
#   - Set APP_ENV=production and APP_DEBUG=false in .config/secrets.env
#   - Set ALLOWED_ORIGINS=https://www.crayhill.com,https://crayhill.com
#   - Open inbound port 443 in the EC2 security group
#   - sudo systemctl reload php-fpm  (Secure session cookies in production)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRAYHILL_REPO="${CRAYHILL_REPO:-$REPO_ROOT}"
DOCROOT="${CRAYHILL_DOCROOT:-/var/www/crayhill}"

CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
CERT_PRIMARY="${CERT_PRIMARY:-www.crayhill.com}"
CERT_ALT="${CERT_ALT:-crayhill.com}"
SSL_CONF_SRC="$REPO_ROOT/config/httpd/crayhill-ssl.conf"
SSL_CONF_DEST="/etc/httpd/conf.d/crayhill-ssl.conf"

if [ -z "$CERTBOT_EMAIL" ]; then
  echo "ERROR: set CERTBOT_EMAIL before running (Let's Encrypt account email)." >&2
  echo "  CERTBOT_EMAIL=you@example.com bash $0" >&2
  exit 1
fi

echo "==> checking DNS for $CERT_PRIMARY"
RESOLVED="$(dig +short "$CERT_PRIMARY" A | head -1 || true)"
if [ -z "$RESOLVED" ]; then
  echo "ERROR: $CERT_PRIMARY does not resolve. Ask the DNS owner to add an A record" >&2
  echo "pointing at this instance's public IP before running certbot." >&2
  exit 1
fi
echo "    $CERT_PRIMARY -> $RESOLVED"

PUBLIC_IP="$(curl -s --max-time 5 http://checkip.amazonaws.com || true)"
if [ -n "$PUBLIC_IP" ] && [ "$RESOLVED" != "$PUBLIC_IP" ] && [ "${CERTBOT_FORCE:-}" != "1" ]; then
  echo "WARNING: $CERT_PRIMARY resolves to $RESOLVED but this box reports public IP $PUBLIC_IP." >&2
  echo "If DNS was just changed, wait for propagation or run with CERTBOT_FORCE=1." >&2
  exit 1
fi

echo "==> installing certbot and mod_ssl"
sudo dnf install -y certbot python3-certbot-apache mod_ssl

echo "==> requesting certificate (HTTP-01 via webroot)"
sudo certbot certonly \
  --webroot \
  -w "$DOCROOT" \
  -d "$CERT_PRIMARY" \
  -d "$CERT_ALT" \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --non-interactive \
  --keep-until-expiring

PHP_FPM_SOCKET="${PHP_FPM_SOCKET:-}"
if [ -z "$PHP_FPM_SOCKET" ] && [ -f /etc/php-fpm.d/www.conf ]; then
  PHP_FPM_SOCKET="$(grep -E '^\s*listen\s*=' /etc/php-fpm.d/www.conf | head -1 | sed -E 's/^[[:space:]]*listen[[:space:]]*=[[:space:]]*//' | tr -d ' ')"
fi
PHP_FPM_SOCKET="${PHP_FPM_SOCKET:-/run/php-fpm/www.sock}"

echo "==> installing HTTPS vhost ($SSL_CONF_DEST)"
sed -e "s|@CRAYHILL_REPO@|$CRAYHILL_REPO|g" \
    -e "s|@PHP_FPM_SOCKET@|$PHP_FPM_SOCKET|g" \
    -e "s|@CERT_NAME@|$CERT_PRIMARY|g" \
    "$SSL_CONF_SRC" | sudo tee "$SSL_CONF_DEST" >/dev/null

echo "==> validating Apache config"
sudo apachectl configtest

echo "==> reloading httpd"
sudo systemctl reload httpd

echo ""
echo "HTTPS setup complete."
echo ""
echo "Next steps (manual):"
echo "  1. Open inbound TCP 443 in the EC2 security group."
echo "  2. Edit $CRAYHILL_REPO/.config/secrets.env on the box:"
echo "       APP_ENV=production"
echo "       APP_DEBUG=false"
echo "       ALLOWED_ORIGINS=https://www.crayhill.com,https://crayhill.com"
echo "  3. sudo systemctl reload php-fpm"
echo "  4. Smoke test:"
echo "       curl -sI https://$CERT_PRIMARY/ | head -5"
echo "       curl -s https://$CERT_PRIMARY/api/v1/health | head -c 120"
echo "  5. Optional: add HTTP → HTTPS redirect in crayhill.conf once verified"
echo "     (see INSTALL.md → DNS cutover and HTTPS). Leave HTTP working until then"
echo "     so certbot webroot renewals on port 80 keep working."
echo ""
echo "Certbot auto-renewal: sudo systemctl status certbot-renew.timer"
