'use strict'

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from './webpack.config.dev'

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  noInfo: false,
  reload: true,
  stats: {
    colors: true
  }
}).listen(3000, 'localhost', (err, result) => {
  if (err) {
    return console.log(err)
  }

  console.log('Listening at http://localhost:3000/')
})
