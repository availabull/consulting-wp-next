<?php

/**
 * Your base production configuration goes in this file. Environment‑specific
 * overrides go in their respective config/environments/{{WP_ENV}}.php file.
 *
 * Keep this file identical in every environment – only .env and the per‑env
 * overrides should differ.
 */

use Roots\WPConfig\Config;
use function Env\env;

// Tell vlucas/php‑dotenv to treat ENV as arrays, convert types, and strip quotes
Env\Env::$options = 31;

/**
 * -----------------------------------------------------------------
 * Path constants
 * -----------------------------------------------------------------
 */
$root_dir   = dirname(__DIR__);         // repository root
$webroot_dir = $root_dir . '/web';      // Apache DocumentRoot

/**
 * -----------------------------------------------------------------
 * Load environment variables from .env / .env.local
 * -----------------------------------------------------------------
 */
if (file_exists($root_dir . '/.env')) {
    $env_files = file_exists($root_dir . '/.env.local') ? ['.env', '.env.local'] : ['.env'];

    $repository = Dotenv\Repository\RepositoryBuilder::createWithNoAdapters()
        ->addAdapter(Dotenv\Repository\Adapter\EnvConstAdapter::class)
        ->addAdapter(Dotenv\Repository\Adapter\PutenvAdapter::class)
        ->immutable()
        ->make();

    $dotenv = Dotenv\Dotenv::create($repository, $root_dir, $env_files, false);
    $dotenv->load();

    $dotenv->required(['WP_HOME', 'WP_SITEURL']);

    // If DATABASE_URL is not present, require classic individual vars
    if (!env('DATABASE_URL')) {
        $dotenv->required(['DB_NAME', 'DB_USER', 'DB_PASSWORD']);
    }
}

/**
 * -----------------------------------------------------------------
 * Global environment & URLs
 * -----------------------------------------------------------------
 */
define('WP_ENV', env('WP_ENV') ?: 'production');

if (!env('WP_ENVIRONMENT_TYPE') && in_array(WP_ENV, ['production', 'staging', 'development', 'local'])) {
    Config::define('WP_ENVIRONMENT_TYPE', WP_ENV);
}

Config::define('WP_HOME',    env('WP_HOME'));
Config::define('WP_SITEURL', env('WP_SITEURL'));

/**
 * -----------------------------------------------------------------
 * Custom content directory (Bedrock convention: /web/app)
 * -----------------------------------------------------------------
 */
Config::define('CONTENT_DIR',      '/app');
Config::define('WP_CONTENT_DIR',   $webroot_dir . Config::get('CONTENT_DIR'));
Config::define('WP_CONTENT_URL',   Config::get('WP_HOME') . Config::get('CONTENT_DIR'));

/**
 * -----------------------------------------------------------------
 * Database
 * -----------------------------------------------------------------
 */
if (env('DB_SSL')) {
    Config::define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
}

Config::define('DB_NAME', env('DB_NAME'));
Config::define('DB_USER', env('DB_USER'));
Config::define('DB_PASSWORD', env('DB_PASSWORD'));
Config::define('DB_HOST', env('DB_HOST') ?: 'localhost');
Config::define('DB_CHARSET', 'utf8mb4');
Config::define('DB_COLLATE', '');
$table_prefix = env('DB_PREFIX') ?: 'wp_';

if (env('DATABASE_URL')) {
    $dsn = (object) parse_url(env('DATABASE_URL'));
    Config::define('DB_NAME',     substr($dsn->path, 1));
    Config::define('DB_USER',     $dsn->user);
    Config::define('DB_PASSWORD', $dsn->pass ?? null);
    Config::define('DB_HOST',     isset($dsn->port) ? "{$dsn->host}:{$dsn->port}" : $dsn->host);
}

/**
 * -----------------------------------------------------------------
 * Authentication keys & salts
 * -----------------------------------------------------------------
 */
Config::define('AUTH_KEY',          env('AUTH_KEY'));
Config::define('SECURE_AUTH_KEY',   env('SECURE_AUTH_KEY'));
Config::define('LOGGED_IN_KEY',     env('LOGGED_IN_KEY'));
Config::define('NONCE_KEY',         env('NONCE_KEY'));
Config::define('AUTH_SALT',         env('AUTH_SALT'));
Config::define('SECURE_AUTH_SALT',  env('SECURE_AUTH_SALT'));
Config::define('LOGGED_IN_SALT',    env('LOGGED_IN_SALT'));
Config::define('NONCE_SALT',        env('NONCE_SALT'));

/**
 * -----------------------------------------------------------------
 * Custom settings
 * -----------------------------------------------------------------
 */
Config::define('AUTOMATIC_UPDATER_DISABLED', true);                     // core updates come via Docker
Config::define('DISABLE_WP_CRON',         env('DISABLE_WP_CRON') ?: false);

/** ───── FILESYSTEM ───────────────────────────────────────────────
 *  Allow WordPress & WP‑CLI to write directly inside the container
 *  (no FTP prompts, fixes Site Health “Could not access filesystem”)
 */
Config::define('FS_METHOD', 'direct');

/**
 * Security‑hardening helpers
 */
Config::define('DISALLOW_FILE_EDIT',  true);   // no Appearance → Editor
Config::define('DISALLOW_FILE_MODS',  true);   // themes/plugins only via CI

/**
 * Performance / housekeeping
 */
Config::define('WP_POST_REVISIONS',   env('WP_POST_REVISIONS') ?? true);
Config::define('CONCATENATE_SCRIPTS', false);

/**
 * -----------------------------------------------------------------
 * Debug
 * -----------------------------------------------------------------
 */
Config::define('WP_DEBUG_DISPLAY', false);
Config::define('WP_DEBUG_LOG',     false);
Config::define('SCRIPT_DEBUG',     false);
ini_set('display_errors', '0');

/**
 * Behind reverse proxy TLS (Traefik)
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

/**
 * -----------------------------------------------------------------
 * Per‑environment overrides
 * -----------------------------------------------------------------
 */
$env_config = __DIR__ . '/environments/' . WP_ENV . '.php';
if (file_exists($env_config)) {
    require_once $env_config;
}

Config::apply();

/**
 * -----------------------------------------------------------------
 * Bootstrap WordPress
 * -----------------------------------------------------------------
 */
if (!defined('ABSPATH')) {
    define('ABSPATH', $webroot_dir . '/wp/');
}
