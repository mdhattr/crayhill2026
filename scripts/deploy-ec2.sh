#!/usr/bin/env bash
#
# One-command EC2 deploy. Run via `npm run deploy` from frontend/ (or directly:
# `bash scripts/deploy-ec2.sh`). End to end it:
#
#   1. git pull          update the working tree (fetch + merge)
#   2. npm ci            clean, lockfile-exact dependency install
#   3. re-exec           relaunch this (possibly just-updated) script
#   4. npm run build     produce frontend/dist
#   5. publish           copy dist -> Apache docroot, fix perms/SELinux, reload httpd
#
# Why the re-exec (step 3): this script is committed to the repo, so the
# `git pull` in step 1 can rewrite the very file bash is executing. Bash reads
# scripts incrementally, so mutating it mid-run is unsafe. After pulling +
# installing we set CRAYHILL_DEPLOY_PULLED=1 and `exec` a fresh copy, so the
# build/publish half always runs the freshly-pulled code.
#
# Paths match INSTALL.md -> "EC2 deployment". They are intentionally fixed to
# the documented production layout (override with the env vars below if a box
# differs):
#   CRAYHILL_DIST     build output   (default: <repo>/frontend/dist)
#   CRAYHILL_DOCROOT  Apache docroot (default: /var/www/crayhill)
#
# Escape hatches:
#   CRAYHILL_SKIP_PULL=1   skip git pull + npm ci (publish-only; rebuilds + copies)
#
# The docroot is kept separate from the git working tree so Apache only ever
# exposes built static files, never the source / .git / node_modules / api.
# Safe to re-run; the docroot is fully republished each time (stale files are
# removed first so deleted assets don't linger).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- Phase 1: pull + install, then re-exec the updated script ----------------
if [ "${CRAYHILL_DEPLOY_PULLED:-}" != "1" ] && [ "${CRAYHILL_SKIP_PULL:-}" != "1" ]; then
  echo "==> git pull (fetch + merge) in $REPO_ROOT"
  # --no-rebase: reconcile via merge (modern Git refuses to pick a strategy on
  #   divergent branches and aborts with "Need to specify how to reconcile").
  # --no-edit: take the default merge commit message instead of opening $EDITOR,
  #   which would hang a non-interactive deploy.
  # If a merge conflict arises, `set -e` aborts the deploy before publishing.
  git -C "$REPO_ROOT" pull --no-rebase --no-edit

  echo "==> npm ci in $REPO_ROOT/frontend"
  ( cd "$REPO_ROOT/frontend" && npm ci )

  echo "==> re-exec deploy with freshly pulled code"
  CRAYHILL_DEPLOY_PULLED=1 exec bash "$REPO_ROOT/scripts/deploy-ec2.sh" "$@"
fi

# --- Phase 2: build ----------------------------------------------------------
echo "==> npm run build in $REPO_ROOT/frontend"
( cd "$REPO_ROOT/frontend" && npm run build )

# --- Phase 3: publish to the docroot -----------------------------------------
DIST="${CRAYHILL_DIST:-$REPO_ROOT/frontend/dist}"
DOCROOT="${CRAYHILL_DOCROOT:-/var/www/crayhill}"

if [ ! -d "$DIST" ]; then
  echo "Build output not found at $DIST — build step must have failed." >&2
  exit 1
fi

echo "==> publishing $DIST -> $DOCROOT"
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

# If the PHP API is wired (see scripts/setup-api-ec2.sh), confirm JSON health.
# A 200 with HTML means FallbackResource is still swallowing /api — News/Careers
# will show empty/error until setup-api-ec2.sh has been run once.
if curl -sf http://localhost/api/v1/health 2>/dev/null | grep -q '"database"'; then
  echo "API health OK (/api/v1/health)."
elif curl -sf http://localhost/api/v1/health 2>/dev/null | grep -qi '<!doctype html'; then
  echo "WARNING: /api/v1/health returned HTML — PHP API is not wired yet." >&2
  echo "         News & Careers will not load DB data until you run:" >&2
  echo "         bash $REPO_ROOT/scripts/setup-api-ec2.sh" >&2
fi

echo "Deploy complete — $DOCROOT republished and httpd reloaded."
