#!/usr/bin/env bash
#
# Routine EC2 deploy: publish the freshly built frontend bundle to the Apache
# docroot and reload the web server. Run AFTER the build (or, more simply, via
# `npm run deploy` from frontend/, which runs `npm run build` then this script).
#
# Paths match INSTALL.md -> "EC2 deployment". They are intentionally fixed to
# the documented production layout (override with the two env vars below if a
# box differs):
#   CRAYHILL_DIST     build output   (default: /var/www/crayhill2026/frontend/dist)
#   CRAYHILL_DOCROOT  Apache docroot (default: /var/www/crayhill)
#
# The docroot is kept separate from the git working tree so Apache only ever
# exposes built static files, never the source / .git / node_modules / api.
#
# Safe to re-run; it fully republishes the bundle each time (stale files in the
# docroot are removed first so deleted assets don't linger).

set -euo pipefail

DIST="${CRAYHILL_DIST:-/var/www/crayhill2026/frontend/dist}"
DOCROOT="${CRAYHILL_DOCROOT:-/var/www/crayhill}"

if [ ! -d "$DIST" ]; then
  echo "Build output not found at $DIST — run 'npm run build' first." >&2
  exit 1
fi

echo "Publishing $DIST -> $DOCROOT"
sudo mkdir -p "$DOCROOT"

# Clear stale files, then copy the fresh bundle. Using find+cp (always present)
# rather than rsync (not guaranteed installed) so this works on a bare box.
sudo find "$DOCROOT" -mindepth 1 -delete
sudo cp -r "$DIST/." "$DOCROOT/"

# Apache serves as the `apache` user; make sure it owns what it serves.
sudo chown -R apache:apache "$DOCROOT"

# Re-apply SELinux labels if SELinux is enforcing (no-op otherwise).
if command -v getenforce >/dev/null 2>&1 && [ "$(getenforce)" = "Enforcing" ]; then
  sudo restorecon -R "$DOCROOT"
fi

sudo systemctl reload httpd
echo "Deploy complete — $DOCROOT republished and httpd reloaded."
