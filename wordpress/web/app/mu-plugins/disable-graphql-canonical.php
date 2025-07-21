<?php

/**
 * Disable WordPress core canonical redirect on the `/graphql` endpoint.
 *
 * We short‑circuit `redirect_canonical()` very early so requests to
 * https://example.com/graphql (no trailing slash) are served directly by
 * WP GraphQL instead of being 301‑redirected to `/graphql/`.
 *
 * @see https://developer.wordpress.org/reference/hooks/redirect_canonical/
 */

add_filter(
    'redirect_canonical',
    static function ($redirect_url, $requested_url) {

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
        $path = wp_parse_url($requested_url, PHP_URL_PATH);

        // Match “…/graphql” or “…/graphql/” (case‑insensitive).
        if ($path && preg_match('#/graphql/?$#i', $path)) {
            return false; // cancel canonical redirect
        }

        return $redirect_url; // default behaviour elsewhere
    },
    5, // run *before* WP core’s canonical check (priority 10)
    2,
);
