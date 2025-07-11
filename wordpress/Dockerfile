# ───────────────────────── 1) Build stage ──────────────────────────
FROM composer:2.7 AS composer               # official Composer image

WORKDIR /app

# ① install prod‑only vendors (leverages layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-progress

# ② copy Bedrock source
COPY . .

# ───────────────────────── 2) Runtime stage ────────────────────────
FROM wordpress:php8.3-apache

# ── make /web the document root ────────────────────────────────────
ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' \
      /etc/apache2/sites-available/000-default.conf

# ── PHP extensions Bedrock / plugins need ──────────────────────────
RUN docker-php-ext-install pdo_mysql

# ── NEW: tools needed inside the container ─────────────────────────
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends mariadb-client \
 && rm -rf /var/lib/apt/lists/* \
 && curl -sSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
      -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp

# ── copy built application into place ──────────────────────────────
WORKDIR /var/www/html
COPY --from=composer /app ./
COPY --from=composer /app/vendor ./vendor

# (optional)  COPY .env .env   # if you ever want to bake it in
