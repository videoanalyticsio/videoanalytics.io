'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const _ = require('lodash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const libraryVersion = require('./package.json').version;

const libraryName = 'videoanalytics.io';
const env = process.env.WEBPACK_ENV;
let outputFile = '';

let plugins = [
	new CleanWebpackPlugin(['dist']),
	new CopyWebpackPlugin([
		{ from: './examples/videos', to: 'examples/videos' }
	]),
	new HtmlWebpackPlugin({
		inject: false,
		title: 'videoanalytics.io',
		filename: path.join(__dirname, 'dist/examples/basic.html'),
		template: path.join(__dirname, 'examples/basic.ejs')
	})
];

if (env === 'build') {
	plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
	outputFile = `${libraryName}-${libraryVersion}.min.js`;
} else {
	outputFile = `${libraryName}-${libraryVersion}.js`;
}

const config = {
	entry: path.resolve(__dirname, 'src/index.js'),
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: outputFile,
		library: 'VideoAnalytics',
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
		contentBase: './dist',
		inline: true,
		stats: {
			chunks: false
		}
	},
	plugins
};

module.exports = config;
