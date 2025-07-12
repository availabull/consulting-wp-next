<?php
/**
 * mu-plugins/ignore-readonly-core.php
 * Silences Site Health alerts about read‑only core files in Docker.
 */
add_filter('wp_is_file_mod_allowed', '__return_true');
