const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { r } = require('./util');

const webpackConfig = {
  // 入口文件
  entry: {
    react: ['react', 'react-dom'],
  },
  // 输出文件
  output: {
    path: r('../dll'),
    filename: '[name].[hash:8].dll.js', // 输出的dll名字
    library: '[name]_library', // 与webpack.DllPlugin的name同步
  },
  plugins: [
    new webpack.DllPlugin({
      path: r('../dll/[name].manifest.json'),
      name: '[name]_library',
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
module.exports = webpackConfig;
