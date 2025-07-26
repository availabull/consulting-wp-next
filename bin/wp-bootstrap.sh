#!/usr/bin/env bash
set -euo pipefail

docker compose exec wordpress bash -eu <<'BOOT'
cd /var/www/html
WP() { wp --path=web/wp --allow-root "$@"; }
log() { printf "\033[36m→ %s\033[0m\n" "$*"; }

# 1. Core install
URL="${WP_HOME:-https://wp.${DOMAIN:-example.com}}"
WP core is-installed >/dev/null 2>&1 || WP core install \
  --url="$URL" --title="Production Site" \
  --admin_user="${WP_ADMIN_USER:-admin}" \
  --admin_password="${WP_ADMIN_PASS:-changeme}" \
  --admin_email="${WP_ADMIN_EMAIL:-you@example.com}" --skip-email

# 2. Activation helper
activate () {
  local P="$1"
  WP plugin is-installed "$P" >/dev/null 2>&1 || { log "❌ $P not installed"; exit 1; }
  WP plugin is-active   "$P" >/dev/null 2>&1 && { log "✔ $P already active"; return; }
  log "Activating $P";  WP plugin activate "$P" || { log "❌ Activation of $P failed"; exit 1; }
}

# 2a base
activate wp-graphql
activate wordpress-seo
WP yoast indexables --reindex || true         # fix first‑run DB tables
activate advanced-custom-fields
activate wpvivid-backuprestore

# 2b extensions
YOAST_GQL=$(WP plugin list --field=name | grep -E '^(add-wpgraphql-seo|wp-graphql-seo|wp-graphql-yoast-seo)$' || true)
[ -n "$YOAST_GQL" ] && activate "$YOAST_GQL"
activate wp-graphql-acf

# 3. Permalinks
WP option update permalink_structure "/%postname%/" >/dev/null
WP rewrite flush --hard >/dev/null

log "Active plugins:"; WP plugin list --status=active --field=name
log "Bootstrap finished ✔"
BOOT
