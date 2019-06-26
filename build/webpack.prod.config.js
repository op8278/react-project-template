// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackBaseConfig = require('./webpack.base.config.js');
const { r, getCSSLoader, getLessLoader } = require('./util');

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'production',

  // 输出文件
  output: {
    filename: 'assets/js/[name].[hash:8].js',
    chunkFilename: 'assets/js/chunk/[name].[chunkhash:8].chunk.js',
  },

  // webpack插件
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebpackPlugin({
      template: r('../index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }),
  ],
});

webpackConfig.module.rules[1]['oneOf'] = [
  getCSSLoader(false), // css的loader
  getLessLoader(false), // less的loader
].concat(webpackConfig.module.rules[1]['oneOf']);

module.exports = webpackConfig;
