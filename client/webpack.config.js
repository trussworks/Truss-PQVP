const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const neatPaths = require("bourbon-neat").includePaths;

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname + '/src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  devtool: 'source-map',
  entry: [
    "react-hot-loader/patch",
    'babel-polyfill',
    'webpack-dev-server/client?http://0.0.0.0:3001',
    'webpack/hot/only-dev-server',
    './src/main'
  ],
  output: {
    filename: 'index_bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'node_modules/uswds/src/fonts'),
        to: 'public/fonts'
      },
      {
        from: path.join(__dirname, 'node_modules/uswds/src/img'),
        to: 'public/img'
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test:   /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: neatPaths,
            }
          },
        ]
      },
      { test: /\.(png|jpg|svg|mp4)$/,
        loader: 'file-loader?name=public/img/[name].[ext]'
      },
      {
        test: /\.woff2?$/,
        loader: 'url-loader',
        options: {
          name: 'public/fonts/[hash].[ext]',
          limit: 50000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: 'public/fonts/[hash].[ext]',
        },
      },
    ]
  }
}
