const webpack = require('webpack');

const isDev = (process.env.NODE_ENV !== 'production');

if (isDev) {
  const config = require('./webpack.config');
  const WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    publicPath: "/",
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/api/*" : "http://localhost:80"
    },
  }).listen(3001, '0.0.0.0', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3001');
  });
}
