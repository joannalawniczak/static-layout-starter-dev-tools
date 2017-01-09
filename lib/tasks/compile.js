'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const gulpIf = require( 'gulp-if' );
const gulpSass = require( 'gulp-sass' );
const gulpCssnano = require( 'gulp-cssnano' );
const gulpAutoprefixer = require( 'gulp-autoprefixer' );
const webpack = require( 'webpack' );
const utils = require( '../utils.js' );
const getWebpackConfig = require( '../webpack.conf.js' );

module.exports = ( config ) => {
	/**
	 * Tasks definition.
	 */
	const tasks = {
		compileScripts( inputPath, outputPath, options = {} ) {
			if ( !fs.existsSync( path.join( config.ROOT_PATH, inputPath ) ) ) {
				return Promise.resolve();
			}

			const webpackConfig = getWebpackConfig( config, {
				inputPath: path.join( config.ROOT_PATH, inputPath ),
				outputPath: path.join( config.ROOT_PATH, outputPath ),
				watch: options.watch,
				debug: options.debug
			} );

			return new Promise( ( resolve, reject ) => {
				webpack( webpackConfig, ( err, stats ) => {
					if ( err ) {
						reject( err );
					}

					gutil.log( stats.toString() );

					resolve();
				} );
			} );
		},

		compileStyles( inputPath, outputPath, options = {} ) {
			if ( options.watch ) {
				const args = Array.from( arguments );
				const options = JSON.parse( JSON.stringify( args[ 2 ] ) );

				options.watch = false;

				gulp.task( '_styles', () => tasks.compileStyles( args[ 0 ], args[ 1 ], options ) );
				gulp.watch( path.join( path.dirname( inputPath ), '**', '*.scss' ), [ '_styles' ] );
			}

			return gulp.src( inputPath )
				.pipe( gulpSass().on( 'error', gulpSass.logError ) )
				.pipe( gulpAutoprefixer( { browsers: [ 'last 2 versions' ] } ) )
				.pipe( gulpIf( !options.debug, gulpCssnano() ) )
				.pipe( gulp.dest( outputPath ) );
		},

		compileStaticFiles( inputPath, outputPath, options = {} ) {
			if ( !utils.isFileExist( inputPath ) ) {
				return Promise.resolve();
			}

			if ( !options.debug ) {
				const from = path.join( inputPath, '**', '*.*' );

				return utils.copy( from, outputPath );
			}

			const arr = outputPath.split( path.sep );

			arr.pop();

			return utils.symlink( inputPath, arr.join( path.sep ) );
		}
	};

	return tasks;
};
