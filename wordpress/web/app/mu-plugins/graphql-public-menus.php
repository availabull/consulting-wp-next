<?php
/**
 * Expose all menus & menu items in WPGraphQL – even if not attached to
 * a theme location.
 */
add_filter(
    'graphql_data_is_private',
    function ( $is_private, $model_name ) {
        if ( 'MenuObject' === $model_name || 'MenuItemObject' === $model_name ) {
            return false;
        }
        return $is_private;
    },
    10,
    2
);
