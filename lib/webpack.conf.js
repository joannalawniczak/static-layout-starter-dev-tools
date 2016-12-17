'use strict';

const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = ( config, options = {} ) => {
	const webpackConfig = {
		resolve: {
			root: [ config.ROOT_PATH ]
		},

		entry: options.inputPath,

		output: {
			path: path.dirname( options.outputPath || '' ),
			filename: path.basename( options.outputPath || '' ),
			libraryTarget: 'umd',
			umdNamedDefine: true,
			library: 'APP'
		},

		module: {
			preLoaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loader: 'babel',
					query: {
						cacheDirectory: true,
						presets: [ 'es2015' ],
						plugins: [ 'transform-es2015-modules-commonjs' ]
					}
				}
			]
		},

		plugins: [],

		watch: false
	};

	if ( options.watch ) {
		webpackConfig.watch = true;
	}

	if ( options.test ) {
		webpackConfig.output = webpackConfig.entry = undefined;
	}

	if ( options.sourcemap ) {
		webpackConfig.devtool = 'inline-source-map';
	}

	if ( options.coverage ) {
		webpackConfig.module.preLoaders[ 0 ].query.plugins.push(
			[ 'istanbul', { 'exclude': [
				'tests/**/*.js',
				'node_modules/**/*.js'
			] } ]
		);
	}

	if ( options.debug ) {
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin( {
				compress: {
					warnings: false
				}
			} )
		);
	}

	return webpackConfig;
};
