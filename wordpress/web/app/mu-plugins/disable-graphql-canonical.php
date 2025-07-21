<?php
/**
 * Disable WordPress core’s redirect_canonical() on /graphql requests.
 * Works before WPGraphQL has a chance to set its constants/helpers.
 *
 * @see https://developer.wordpress.org/reference/hooks/redirect_canonical/
 */
add_filter(
    'redirect_canonical',
    static function ( $redirect_url, $requested_url ) {

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
        $path = wp_parse_url( $requested_url, PHP_URL_PATH );

        // Match …/graphql or …/graphql/  (case‑insensitive)
        if ( $path && preg_match( '#/graphql/?$#i', $path ) ) {
            return false;   // cancel canonical redirect
        }

        return $redirect_url;   // keep normal behaviour elsewhere
    },
    5,      // run *before* WP’s built‑in canonical check (priority 10)
    2
);
