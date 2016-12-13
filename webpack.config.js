'use strict';

const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const libraryVersion = require('./package.json').version;

const libraryName = 'videoanalytics.io';
const env = process.env.WEBPACK_ENV;
let outputFile = '';

let plugins = [
	new CleanWebpackPlugin(['dist']),
	new WriteFilePlugin()
];

if (env === 'build') {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
        warnings: false
      }
		}),
		new UnminifiedWebpackPlugin()
	);
	outputFile = `${libraryName}.min.js`;
} else {
	outputFile = `${libraryName}.js`;
}

const config = {
	entry: path.resolve(__dirname, 'src/index.js'),
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: outputFile,
		library: 'VideoAnalyticsIO',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
	  loaders: [
	    {
	      test: /(\.jsx|\.js)$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel-loader',
	      query: {
	        presets: ['es2015']
	      }
	    },
	    {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /(node_modules|bower_components)/
      }
	  ]
	},
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	},
	devServer: {
		inline: true,
		outputPath: path.resolve(__dirname, 'dist'),
		stats: {
			chunks: false
		}
	},
	plugins
};

module.exports = config;
