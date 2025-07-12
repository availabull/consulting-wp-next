# ───────────────────────── 1) Build stage ──────────────────────────
# official Composer image
FROM composer:2.7 AS composer

WORKDIR /app

# ① install prod‑only vendors (leverages layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-progress

# ② copy Bedrock source
COPY . .

# ───────────────────────── 2) Runtime stage ────────────────────────
# official WordPress + PHP 8.3 image
FROM wordpress:php8.3-apache

# ─── Apache document‑root → /web ───────────────────────────────────
ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' \
      /etc/apache2/sites-available/000-default.conf

# ─── PHP extensions & tools ────────────────────────────────────────
RUN docker-php-ext-install pdo_mysql

# add unzip + curl so we can fetch the Hello theme
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends mariadb-client unzip curl \
 && rm -rf /var/lib/apt/lists/* \
 && curl -sSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
      -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp

# ─── Bedrock source + vendor from build stage ──────────────────────
WORKDIR /var/www/html
COPY --from=composer /app ./
COPY --from=composer /app/vendor ./vendor

# ─── keep Site‑Health green → pre‑create wp‑content/upgrade ────────
RUN mkdir -p /var/www/html/web/app/upgrade

# ─── bake Hello Elementor theme into the image (always present) ────
RUN curl -sSL https://downloads.wordpress.org/theme/hello-elementor.zip \
      -o /tmp/hello.zip \
 && unzip -q /tmp/hello.zip -d web/app/themes \
 && rm /tmp/hello.zip

# ─── remove bundled Twenty* themes so only Hello ships ─────────────
RUN rm -rf web/wp/wp-content/themes/twenty*

# ─── correct ownership of everything we touched ────────────────────
RUN chown -R www-data:www-data /var/www/html/web/app

# (optional) COPY .env .env   # if you ever want to bake it in
# base image entrypoint already keeps Apache in the foreground
