#!/usr/bin/env bash
set -euo pipefail
# ---------------------------------------------------------------------------
# Bootstraps WordPress inside the "wordpress" service (Bedrock structure).
# ---------------------------------------------------------------------------

docker compose exec wordpress bash -eu <<'BOOT'

cd /var/www/html   # Bedrock root

WP() { wp --path=web/wp --allow-root "$@"; }
say() { printf "\033[34m── %s\033[0m\n" "$*"; }

# ───────── 1. Core install ─────────
URL="${WP_HOME:-https://wp.${DOMAIN:-example.com}}"
if ! WP core is-installed > /dev/null 2>&1; then
  say "Installing WordPress core …"
  WP core install \
    --url="$URL" --title="Production Site" \
    --admin_user="${WP_ADMIN_USER:-admin}" \
    --admin_password="${WP_ADMIN_PASS:-changeme}" \
    --admin_email="${WP_ADMIN_EMAIL:-you@example.com}" \
    --skip-email
else
  say "WordPress already installed"
fi

# ───────── 2. Plugin activation ─────
activate() {
  local PLUGIN="$1"
  if WP plugin is-installed "$PLUGIN" > /dev/null 2>&1; then
    if ! WP plugin is-active "$PLUGIN" > /dev/null 2>&1; then
      say "Activating $PLUGIN …"
      WP plugin activate "$PLUGIN" || {
        echo "✖ Failed to activate $PLUGIN" >&2
        WP plugin status "$PLUGIN"
        exit 1
      }
    fi
  fi
}

# 2a. Base plugins
for p in wp-graphql wordpress-seo advanced-custom-fields wpvivid-backuprestore; do
  activate "$p"
done

# 2b. Yoast SEO bridge (slug can vary by package/version)
YOAST_GQL_SLUG=$(WP plugin list --field=name | grep -E '^(wp-graphql-seo|wp-graphql-yoast-seo|add-wpgraphql-seo)$' || true)
if [ -n "$YOAST_GQL_SLUG" ]; then
  activate "$YOAST_GQL_SLUG"
else
  echo "✖ Could not locate WPGraphQL‑SEO plugin directory" >&2
fi

# 2c. ACF bridge
activate wp-graphql-acf

say "Active plugins:"
WP plugin list --status=active --field=name

# ───────── 3. Permalinks ────────────
say "Ensuring pretty permalinks"
WP option update permalink_structure "/%postname%/" > /dev/null
WP rewrite flush --hard > /dev/null

say "Bootstrap finished ✔"
BOOT
