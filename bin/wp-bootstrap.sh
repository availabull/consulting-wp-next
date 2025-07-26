#!/usr/bin/env bash
set -euo pipefail

docker compose exec wordpress bash -eu <<'BOOT'
cd /var/www/html
WP() { wp --path=web/wp --allow-root "$@"; }

log() { printf "\033[36m→ %s\033[0m\n" "$*"; }

# 1. Core
URL="${WP_HOME:-https://wp.${DOMAIN:-example.com}}"
WP core is-installed >/dev/null 2>&1 || WP core install \
  --url="$URL" --title="Production Site" \
  --admin_user="${WP_ADMIN_USER:-admin}" \
  --admin_password="${WP_ADMIN_PASS:-changeme}" \
  --admin_email="${WP_ADMIN_EMAIL:-you@example.com}" --skip-email

# 2. Plugin activation helper (no suppression)
activate () {
  local PLUGIN="$1"
  if ! WP plugin is-installed "$PLUGIN" >/dev/null 2>&1; then
    log "❌ $PLUGIN not installed"; exit 1;
  fi

  if WP plugin is-active "$PLUGIN" >/dev/null 2>&1; then
    log "✔ $PLUGIN already active"
  else
    log "Activating $PLUGIN"
    if ! WP plugin activate "$PLUGIN"; then
      log "❌ Activation of $PLUGIN failed (see message above)"
      exit 1
    fi
  fi
}

# base set
activate wp-graphql
activate wordpress-seo
activate advanced-custom-fields
activate wpvivid-backuprestore

# extensions
YOAST_GQL=$(WP plugin list --field=name | grep -E '^(add-wpgraphql-seo|wp-graphql-seo|wp-graphql-yoast-seo)$' || true)
[ -n "$YOAST_GQL" ] && activate "$YOAST_GQL"
activate wp-graphql-acf

# 3. permalinks
WP option update permalink_structure "/%postname%/" >/dev/null
WP rewrite flush --hard >/dev/null

log "Active plugins:"
WP plugin list --status=active --field=name
BOOT
