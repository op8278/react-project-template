// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const webpackBaseConfig = require('./webpack.base.config.js');

const { r } = require('./util');

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  // 入口文件
  entry: {
    app: [r('../src/index.js')],
  },
  // 输出文件
  output: {
    filename: '[name].[hash].js',
  },
  // webpack插件
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});

module.exports = webpackConfig;
