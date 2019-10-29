'use strict'

// import path from 'path'
import webpack from 'webpack'
import baseConfig from './webpack.config.base'

export default {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: {
    ...baseConfig.entry,
    bundle: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ]
  },

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/app/'
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  target: 'electron-renderer'
}
