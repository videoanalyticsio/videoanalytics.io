const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const libraryName = 'videoanalytics.io';
const env = process.env.WEBPACK_ENV;
let plugins = [];
let outputFile = '';

plugins.push(new HtmlWebpackPlugin({
	title: 'videoanalytics.io',
	filename: path.join(__dirname, 'examples/basic.html'),
	template: path.join(__dirname, 'examples/templates/basic.ejs')
}));

if (env === 'build') {
	plugins.push(new UglifyJsPlugin({ minimize: true }));
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
		library: libraryName,
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
        exclude: /node_modules/
      }
	  ]
	},
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	},
	plugins
};

module.exports = config;
