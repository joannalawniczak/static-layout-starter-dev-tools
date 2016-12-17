'use strict';

const fs = require( 'fs' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const vfs = require( 'vinyl-fs' );

const utils = {
	parseArgs( args ) {
		return require( 'minimist' )( args, {
			boolean: [ 'coverage', 'watch', 'sourcemap', 'debug' ],
			string: [ 'files', 'format' ],
			alias: {
				coverage: 'c',
				sourcemap: 's',
				watch: 'w',
				files: 'f',
				debug: 'd'
			}
		} );
	},

	/**
	 * Checks if file in specified locarion exist.
	 *
	 * @param {String} path File path
	 * @returns {Boolean}
	 */
	isFileExist( path ) {
		try {
			fs.accessSync( path );
		} catch ( e ) {
			return false;
		}

		return true;
	},

	/**
	 * Creates a symlink.
	 *
	 * @param {String} from Source directory.
	 * @param {String} to Destination.
	 * @returns {Stream}
	 */
	symlink( from, to ) {
		return vfs.src( from, { followSymlinks: false } )
			.pipe( vfs.symlink( to ) );
	},

	/**
	 * Copy file or directory.
	 *
	 * @param {String} from Source directory.
	 * @param {String} to Destination.
	 * @returns {Stream}
	 */
	copy( from, to ) {
		return gulp.src( from )
			.pipe( gulp.dest( to ) );
	},

	del: del
};

module.exports = utils;
