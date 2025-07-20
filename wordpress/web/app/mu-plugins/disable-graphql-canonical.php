<?php

/**
 * Allow the GraphQL endpoint without a trailing slash.
 * Prevents WordPress from redirecting /graphql to /graphql/.
 */
add_filter('redirect_canonical', static function ($canonical_url, $requested_url) {
    if (function_exists('is_graphql_http_request') && is_graphql_http_request()) {
        return false;
    }
    return $canonical_url;
}, 10, 2);
