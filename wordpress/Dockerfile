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

# make /web the document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' \
      /etc/apache2/sites-available/000-default.conf

# PHP extensions Bedrock / plugins need
RUN docker-php-ext-install pdo_mysql

# NEW: tools required at runtime (MariaDB client + WP‑CLI)
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends mariadb-client unzip curl \
 && rm -rf /var/lib/apt/lists/* \
 && curl -sSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
      -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp

# copy Bedrock and vendor directory from build stage
WORKDIR /var/www/html
COPY --from=composer /app ./
COPY --from=composer /app/vendor ./vendor

# ── NEW: pre‑create wp‑content/upgrade so Site‑Health stays green
RUN mkdir -p /var/www/html/web/app/upgrade

# ── NEW: bake Hello Elementor theme into the image
RUN curl -sSL https://downloads.wordpress.org/theme/hello-elementor.zip \
      -o /tmp/hello.zip \
 && unzip -q /tmp/hello.zip -d web/app/themes \
 && rm /tmp/hello.zip

# correct ownership for everything we created
RUN chown -R www-data:www-data /var/www/html/web/app

# (optional) COPY .env .env   # if you ever want to bake it in

# keep Apache foreground (handled by base image entrypoint)
