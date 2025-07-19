<?php
/**
 * Force `got_rewrite` to `true` when WP‑CLI runs so that
 * `wp rewrite flush --hard` always recreates /web/.htaccess
 * inside the container.
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	add_filter( 'got_rewrite', static fn () => true, 99 );
}
