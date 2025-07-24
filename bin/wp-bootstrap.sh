set -eu

docker compose exec wordpress bash -c '
  cd /var/www/html/web &&
  URL=${WP_HOME:-https://wp.${DOMAIN:-example.com}} &&
  wp core is-installed --allow-root || wp core install \
      --url="$URL" \
      --title="Production Site" \
      --admin_user=${WP_ADMIN_USER:-admin} \
      --admin_password=${WP_ADMIN_PASS:-changeme} \
      --admin_email=${WP_ADMIN_EMAIL:-you@example.com} \
      --skip-email --allow-root &&
  wp option update permalink_structure "/%postname%/" --allow-root &&
  wp plugin activate wp-graphql --allow-root &&
  wp rewrite flush --hard --allow-root
'


wp core is-installed --allow-root || wp core install \
  --url=https://wp.${DOMAIN} \
  --title="Production Site" \
  --admin_user=${WP_ADMIN_USER:-admin} \
  --admin_password=${WP_ADMIN_PASS:-changeme} \
  --admin_email=${WP_ADMIN_EMAIL:-you@example.com} \
  --skip-email --allow-root &&


wp plugin activate \
  wp-graphql \
  wp-graphql-menus \
  wordpress-seo \
  wp-graphql-yoast-seo \
  --allow-root &&

wp option update permalink_structure "/%postname%/" --allow-root &&
wp rewrite flush --hard --allow-root
