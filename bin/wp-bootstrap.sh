#!/usr/bin/env bash
set -eu
# ---------------------------------------------------------------------------
# Bootstraps WordPress inside the "wordpress" service (Bedrock structure).
# ---------------------------------------------------------------------------

docker compose exec wordpress bash -eu <<'BOOT'

cd /var/www/html   # Bedrock root (not /web)

# ────────────────────────── 1. Install Core if missing ─────────────────────
URL="${WP_HOME:-https://wp.${DOMAIN:-example.com}}"

wp core is-installed --allow-root || wp core install \
  --url="$URL" \
  --title="Production Site" \
  --admin_user="${WP_ADMIN_USER:-admin}" \
  --admin_password="${WP_ADMIN_PASS:-changeme}" \
  --admin_email="${WP_ADMIN_EMAIL:-you@example.com}" \
  --skip-email --allow-root

# ────────────────────────── 2. Activate plugins in dependency order ─────────
# 1) BASE plugins (no dependencies)
BASE_PLUGINS=(
  wp-graphql
  wordpress-seo
  advanced-custom-fields
  wpvivid-backuprestore
)

# 2) EXTENSIONS that depend on the base set
EXT_PLUGINS=(
  wp-graphql-yoast-seo   # needs wp-graphql + wordpress-seo
  wp-graphql-acf         # needs wp-graphql + ACF
)

activate() {
  local PLUGIN="$1"
  if wp plugin is-installed "$PLUGIN" --allow-root; then
    wp plugin is-active "$PLUGIN" --allow-root || wp plugin activate "$PLUGIN" --allow-root
  fi
}

for PLUGIN in "${BASE_PLUGINS[@]}"; do
  activate "$PLUGIN"
done

for PLUGIN in "${EXT_PLUGINS[@]}"; do
  activate "$PLUGIN"
done

# ────────────────────────── 3. Permalink structure & flush ──────────────────
wp option update permalink_structure "/%postname%/" --allow-root
wp rewrite flush --hard --allow-root

BOOT
