const webpack = require('webpack');

const isDev = (process.env.NODE_ENV !== 'production');

if (isDev) {
  const config = require('./webpack.config');
  const WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    publicPath: "/",
    hot: true,
  }).listen(3001, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3001');
  });
}
