#!/usr/bin/env bash
set -eu
# ---------------------------------------------------------------------------
# Bootstraps WordPress inside the "wordpress" service (Bedrock structure).
# ---------------------------------------------------------------------------

docker compose exec wordpress bash -eu <<'BOOT'

cd /var/www/html/web

# ────────────────────────── 1. Core install (if missing) ────────────────────
URL="${WP_HOME:-https://wp.${DOMAIN:-example.com}}"

wp core is-installed --allow-root || wp core install \
  --url="$URL" \
  --title="Production Site" \
  --admin_user="${WP_ADMIN_USER:-admin}" \
  --admin_password="${WP_ADMIN_PASS:-changeme}" \
  --admin_email="${WP_ADMIN_EMAIL:-you@example.com}" \
  --skip-email --allow-root

# ────────────────────────── 2. Activate required plugins ────────────────────
REQUIRED_PLUGINS=(
  wp-graphql
  wordpress-seo
  wp-graphql-yoast-seo
)

for PLUGIN in "${REQUIRED_PLUGINS[@]}"; do
  # skip if the plugin folder is missing (e.g. not installed)
  if wp plugin is-installed "$PLUGIN" --allow-root; then
    wp plugin is-active "$PLUGIN" --allow-root || wp plugin activate "$PLUGIN" --allow-root
  fi
done

# ────────────────────────── 3. Permalink structure & flush ──────────────────
wp option update permalink_structure "/%postname%/" --allow-root
wp rewrite flush --hard --allow-root

BOOT
