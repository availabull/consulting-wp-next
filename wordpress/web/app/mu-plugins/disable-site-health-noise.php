<?php

/**
 * Bedrock / Docker: hide Site‑Health items that are irrelevant in an
 * immutable, image‑based deployment.
 *
 * Disabled tests:
 * - background_updates    → core auto‑updates disabled (image handles it)
 * - wordpress_filesystem  → core is read‑only on purpose
 * - plugin_version        → we update/activate plugins via CI
 * - page_cache            → handled by WP Super Cache + Cloudflare
 */

add_filter('site_status_tests', function ($tests) {

    $disabled = [
        'background_updates',   // $tests['direct']
        'wordpress_filesystem', // $tests['async']
        'plugin_version',       // $tests['async']
        'page_cache',           // $tests['async']
    ];

    foreach ($tests as $group => $group_tests) {
        foreach ($group_tests as $slug => $test) {
            if (in_array($slug, $disabled, true)) {
                unset($tests[$group][$slug]);
            }
        }
    }

    return $tests;
});
