'use strict';

const del = require( 'del' );

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

	del: del
};

module.exports = utils;
