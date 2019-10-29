// translate main.js

import webpack from 'webpack'
import baseConfig from './webpack.config.base'

export default {
  ...baseConfig,

  entry: './src/main.dev',

  output: {
    path: __dirname,
    filename: './app/main.js'
  },

  // module: {
  //   ...baseConfig.module
  // },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    // new webpack.BannerPlugin(
    //   'require("source-map-support").install();',
    //   { raw: true, entryOnly: false }
    // ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  target: 'electron-main'

  // externals: [
  //   ...baseConfig.externals,
  //   'source-map-support'
  // ]
}
