var ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack'),
  	 glob = require('glob');
// Webpack 2
var loaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      postcss: {}
    }
  },
  {
    loader: 'sass-loader'
  }
]
const path = require('path');
module.exports = {
	entry: './app.js',   	//  `${__dirname}/src/app.js`  
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /(\.css|\.scss)$/,
				use: ExtractTextPlugin.extract({
						  fallback: 'style-loader',
						  use: loaders,
						})
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
  				use: 'file-loader'
			},
			{ test: /\.json$/, use: 'json-loader' }
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css"),
		// Pro-tip: Order matters here.
	    // Minify assets.
	    /*new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false // https://github.com/webpack/webpack/issues/1496
	      }
	    })*/

	]
}