# ───────────────────────── 1) Build stage ──────────────────────────
FROM composer:2.7 AS composer
# (official Composer image)

WORKDIR /app

# ① install prod‑only vendors (cached)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-progress

# ② copy Bedrock source
COPY . .

# ───────────────────────── 2) Runtime stage ────────────────────────
FROM wordpress:php8.3-apache

# Make /web the document‑root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' \
      /etc/apache2/sites-available/000-default.conf

# PHP extensions Bedrock/plugins need
RUN docker-php-ext-install pdo_mysql

WORKDIR /var/www/html

# copy Bedrock + vendor from build stage
COPY --from=composer /app ./
COPY --from=composer /app/vendor ./vendor

# optional: add runtime .env if you bake it in
# COPY .env .env
