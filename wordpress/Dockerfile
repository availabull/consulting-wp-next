# wordpress/Dockerfile
FROM wordpress:php8.3-apache

# Optional PHP extension needed for Bedrock
RUN docker-php-ext-install pdo_mysql

# Copy Bedrock source
WORKDIR /var/www/html
COPY . .

# Copy runtime configuration (.env) into the image
COPY .env .env