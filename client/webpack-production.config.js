const path                          = require('path');
const webpack                       = require('webpack');
const HTMLWebpackPlugin             = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname + '/src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  devtool: 'source-map',
  entry: [
    // Set up an ES6-ish environment
    'babel-polyfill',
    './src/main'
  ],
  output: {
    filename: 'index_bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify('production'),
      FB_CONFIG: JSON.stringify("1565113137123334"),
    }),
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test:   /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
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
};
