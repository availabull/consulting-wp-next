<?php
/**
 * Bedrock / Docker: hide Site‑Health items that are irrelevant in an
 * immutable, image‑based deployment.
 *
 * - background_updates    → core auto‑updates are intentionally disabled
 * - wordpress_filesystem  → core files are read‑only by design
 *
 * Any new tests can be nulled by adding their slug to $disabled.
 */

add_filter( 'site_status_tests', function ( $tests ) {

    $disabled = [
        'background_updates',   // key lives in $tests['direct']
        'wordpress_filesystem', // key lives in $tests['async']
    ];

    foreach ( $tests as $group => $group_tests ) {
        foreach ( $group_tests as $index => $test ) {
            if ( in_array( $index, $disabled, true ) ) {
                unset( $tests[ $group ][ $index ] );
            }
        }
    }
    return $tests;
} );
