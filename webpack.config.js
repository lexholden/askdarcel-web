const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');

// Change this to config.js and add a key to the config file
const config = require(path.resolve(__dirname, 'app/utils/config.example.js'));

const appRoot = path.resolve(__dirname, 'app/');
const buildDir = path.resolve(__dirname, 'build');

module.exports = {
  context: __dirname,
  entry: ['react-hot-loader/patch', 'whatwg-fetch', path.resolve(appRoot, 'init.js')],
  output: {
    path: buildDir,
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Ask Darcel',
      template: 'app/index.html',
    }),
    new ExtendedDefinePlugin({
      CONFIG: config,
    }),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { loader: 'react-hot-loader' },
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-2'],
              // plugins: ['react-hot-loader/babel'],
            },
          },
        ],
        exclude: [/node_modules/, /typings/],
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[sha512:hash:hex:8].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optimizationLevel: 7,
              interlaced: false,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: buildDir,
    historyApiFallback: true,
    devtool: 'source-map',
    colors: true,
    proxy: {
      '/api/*': {
        target: process.env.API_URL || 'http://localhost:3000',
        rewrite(req) {
          req.url = req.url.replace(/^\/api/, '');
        },
      },
    },
  },
};
