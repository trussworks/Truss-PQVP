const path                          = require('path');
const webpack                       = require('webpack');
const HTMLWebpackPlugin             = require('html-webpack-plugin');

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
        loaders: ['babel', 'eslint-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test:   /\.css$/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
};
