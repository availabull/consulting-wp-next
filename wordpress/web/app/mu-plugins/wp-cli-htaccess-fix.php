<?php

/**
 * Force `got_rewrite` to `true` when WP‑CLI runs
 * so `wp rewrite flush --hard` always recreates /web/.htaccess.
 */
if (defined('WP_CLI') && WP_CLI) {
    add_filter('got_rewrite', static fn() => true, 99);
}
