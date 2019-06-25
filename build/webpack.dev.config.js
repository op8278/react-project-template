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
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.config.js');
const { r } = require('./util');

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
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
    new HtmlWebpackPlugin({
      template: r('../index.html'),
    }),
  ],
  // 开发服务器
  // #https://webpack.js.org/configuration/dev-server/#devserver
  devServer: {
    contentBase: r('../dist'), // 指向打包的目录
    host: '0.0.0.0',
    port: 3000,
    inline: true, // 更新代码时,刷新浏览器
    hot: false, // 是否开启热替换(HotModuleRepalce),需要和webpack.HotModuleReplacementPlugin配合
    compress: true, // 开启gzip
    overlay: {
      errors: true,
    },
    public: 'localhost:3000', // 当使用内联模式(inline mode)并代理 dev-server 时，内联的客户端脚本并不总是知道要连接到什么地方。它会尝试根据 window.location 来猜测服务器的 URL，但是如果失败，你需要使用这个配置。
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html',
    }, // 404退回首页
    open: true, // 打开浏览器
  },
});

module.exports = webpackConfig;
