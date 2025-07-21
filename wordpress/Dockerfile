# ───────────────────────── 1) Build stage ──────────────────────────
FROM composer:2.7 AS composer
WORKDIR /app

# ① Prod‑only vendors
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-progress

# ② Bedrock source
COPY . .

# ───────────────────────── 2) Runtime stage ────────────────────────
FROM wordpress:php8.3-apache

# ─── Apache document‑root → /web ───────────────────────────────────
ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' \
      /etc/apache2/sites-available/000-default.conf

# ─── PHP extensions & helpers ──────────────────────────────────────
RUN docker-php-ext-install pdo_mysql
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends mariadb-client unzip curl \
 && rm -rf /var/lib/apt/lists/* \
 && curl -sSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
      -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp

# ─── Allow .htaccess overrides for Bedrock ─────────────────────────
RUN printf '<Directory /var/www/html/web>\n AllowOverride All\n</Directory>\n' \
        > /etc/apache2/conf-available/allow-bedrock-htaccess.conf \
 && a2enconf allow-bedrock-htaccess

# ─── Bedrock source + vendor from build stage ──────────────────────
WORKDIR /var/www/html
COPY --from=composer /app ./
COPY --from=composer /app/vendor ./vendor

# ─── Helper MU‑plugins ─────────────────────────────────────────────
COPY web/app/mu-plugins/wp-cli-htaccess-fix.php web/app/mu-plugins/
COPY web/app/mu-plugins/disable-graphql-canonical.php web/app/mu-plugins/

# ─── keep Site‑Health green → pre‑create wp‑content/upgrade ────────
RUN mkdir -p /var/www/html/web/app/upgrade

# ─── bake Hello Elementor theme into the image ─────────────────────
RUN curl -sSL https://downloads.wordpress.org/theme/hello-elementor.zip \
      -o /tmp/hello.zip \
 && unzip -q /tmp/hello.zip -d web/app/themes \
 && rm /tmp/hello.zip

# ─── remove bundled Twenty* themes (core + Bedrock copy) ───────────
RUN rm -rf /var/www/html/web/wp/wp-content/themes/twenty* \
           /var/www/html/web/app/themes/twenty*

# ─── ⭐ ensure writable .htaccess so rewrites always persist ────────
RUN touch /var/www/html/web/.htaccess \
 && chown www-data:www-data /var/www/html/web/.htaccess

# ─── correct ownership of everything we touched ────────────────────
RUN chown -R www-data:www-data /var/www/html/web
