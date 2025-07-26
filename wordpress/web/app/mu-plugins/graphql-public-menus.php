<?php

/**
 * Make all menus & menu items public in WP GraphQL, even if they aren’t
 * assigned to a theme location.
 *
 * @param bool   $is_private Whether WPGraphQL thinks the data is private.
 * @param string $model_name GraphQL model name.
 *
 * @return bool
 */
add_filter(
    'graphql_data_is_private',
    static function ($is_private, $model_name) {
        if (in_array($model_name, ['MenuObject', 'MenuItemObject'], true)) {
            return false;
        }

        return $is_private;
    },
    10,
    2, // ← trailing comma required for multi‑line argument list
);
