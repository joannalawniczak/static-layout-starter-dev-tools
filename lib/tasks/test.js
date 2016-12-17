'use strict';

const KarmaServer = require( 'karma' ).Server;
const getKarmaConfig = require( '../karma.conf.js' );

module.exports = ( config ) => {
	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Runs JS unit tests.
		 *
		 * @param {Function} done Finish callback.
		 * @param {Object} [options={}] Additional options.
		 * @param {Boolean} [options.coverage] When `true` then coverage report will be generated.
		 * @param {String} [options.files] Glob with selected for test files.
		 */
		test( options ) {
			return new Promise( ( resolve ) => {
				new KarmaServer( getKarmaConfig( config, options ), resolve ).start();
			} );
		}
	};
};
