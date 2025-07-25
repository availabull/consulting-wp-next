#!/usr/bin/env bash
set -eu

docker compose exec wordpress bash -c '
  cd /var/www/html/web

  # ──────────────────────────── 1. Install Core  ────────────────────────────────
  URL=${WP_HOME:-https://wp.${DOMAIN:-example.com}}

  wp core is-installed --allow-root || wp core install \
      --url="$URL" \
      --title="Production Site" \
      --admin_user=${WP_ADMIN_USER:-admin} \
      --admin_password=${WP_ADMIN_PASS:-changeme} \
      --admin_email=${WP_ADMIN_EMAIL:-you@example.com} \
      --skip-email --allow-root

  # ──────────────────────────── 2. Activate Plugins ─────────────────────────────
  # Core GraphQL
  wp plugin is-active wp-graphql --allow-root || wp plugin activate wp-graphql --allow-root

  # New additions
  for PLUGIN in wp-graphql-menus wordpress-seo wp-graphql-yoast-seo; do
    wp plugin is-active "$PLUGIN" --allow-root || wp plugin activate "$PLUGIN" --allow-root
  done

  # ──────────────────────────── 3. Permalinks & flush ───────────────────────────
  wp option update permalink_structure "/%postname%/" --allow-root
  wp rewrite flush --hard --allow-root
'
