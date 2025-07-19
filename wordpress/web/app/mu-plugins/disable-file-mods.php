<?php

/**
 * Suppress the “some core files are not writable” Site‑Health test.
 * The stack is immutable (Docker image); WP should never edit core.
 */
add_filter('site_status_tests', function ($tests) {
    unset($tests['async']['wordpress_filesystem']);
    return $tests;
});
