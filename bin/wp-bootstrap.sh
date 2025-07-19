set -eu
docker compose exec wordpress bash -c '


 cd /var/www/html/web
wp core is-installed --allow-root || wp core install \
       --url=http://localhost:8080 \
       --title="Fresh Site" \
       --admin_user=admin \
       --admin_password=change-me \
       --admin_email=robert@robertfisher.com \
       --skip-email --allow-root

  wp option update permalink_structure "/%postname%/" --allow-root
  wp plugin activate wp-graphql --allow-root
  wp rewrite flush --hard --allow-root
'
