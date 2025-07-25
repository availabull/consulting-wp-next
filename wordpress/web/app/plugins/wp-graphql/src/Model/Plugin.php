<?php

namespace WPGraphQL\Model;

use GraphQLRelay\Relay;

/**
 * Class Plugin - Models the Plugin object
 *
 * @property ?string $author
 * @property ?string $authorUri
 * @property ?string $description
 * @property ?string $id
 * @property ?string $name
 * @property ?string $path
 * @property ?string $pluginUri
 * @property ?string $version
 *
 * @package WPGraphQL\Model
 *
 * @extends \WPGraphQL\Model\Model<array<string,mixed>>
 */
class Plugin extends Model {
	/**
	 * Plugin constructor.
	 *
	 * @param array<string,mixed> $plugin The incoming Plugin data to be modeled.
	 */
	public function __construct( $plugin ) {
		$this->data = $plugin;
		parent::__construct();
	}

	/**
	 * {@inheritDoc}
	 */
	protected function is_private() {
		if ( is_multisite() ) {
				// update_, install_, and delete_ are handled above with is_super_admin().
				$menu_perms = get_site_option( 'menu_items', [] );
			if ( empty( $menu_perms['plugins'] ) && ! current_user_can( 'manage_network_plugins' ) ) {
				return true;
			}
		} elseif ( ! current_user_can( 'activate_plugins' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * {@inheritDoc}
	 */
	protected function init() {
		if ( empty( $this->fields ) ) {
			$this->fields = [
				'author'      => function () {
					return ! empty( $this->data['Author'] ) ? $this->data['Author'] : null;
				},
				'authorUri'   => function () {
					return ! empty( $this->data['AuthorURI'] ) ? $this->data['AuthorURI'] : null;
				},
				'description' => function () {
					return ! empty( $this->data['Description'] ) ? $this->data['Description'] : null;
				},
				'id'          => function () {
					return ! empty( $this->path ) ? Relay::toGlobalId( 'plugin', $this->path ) : null;
				},
				'name'        => function () {
					return ! empty( $this->data['Name'] ) ? $this->data['Name'] : null;
				},
				'path'        => function () {
					return ! empty( $this->data['Path'] ) ? $this->data['Path'] : null;
				},
				'pluginUri'   => function () {
					return ! empty( $this->data['PluginURI'] ) ? $this->data['PluginURI'] : null;
				},
				'version'     => function () {
					return ! empty( $this->data['Version'] ) ? $this->data['Version'] : null;
				},
			];
		}
	}
}
