/* eslint-disable camelcase */
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
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const PurifycssWebpack = require('purifycss-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const isWsl = require('is-wsl');
const glob = require('glob-all');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// eslint-disable-next-line no-unused-vars
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.config.js');
const { r, getCSSLoader, getLessLoader, getDllEntry } = require('./util');

const webpackConfig = webpackMerge(webpackBaseConfig, {
  mode: 'production',

  // 输出文件
  output: {
    filename: 'assets/js/[name].[chunkhash:8].js',
    chunkFilename: 'assets/js/chunk/[name].[chunkhash:8].chunk.js',
  },
  optimization: {
    minimize: true,
    usedExports: true, // 目的: 辅助 js 的 Tree Shaking
    noEmitOnErrors: true, // 当发生错误时,不生成文件
    moduleIds: 'hashed', // 把默认的 module Id 数字自增加的模式,改为hash算法,保证当一个chunk删除/新增一个模块时,不会影响其他chunk的chunkhash值
    namedChunks: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          // #https://github.com/terser-js/terser#compress-options
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            drop_debugger: true, // 去除代码中的debugger
            // eslint-disable-next-line @typescript-eslint/camelcase
            drop_console: true, // 去除代码中的console
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            // eslint-disable-next-line @typescript-eslint/camelcase
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: false,
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        parser: safePostCssParser,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true }, autoprefixer: { disable: true } }],
        },
        canPrint: true,
      }),
    ],
    // #https://webpack.docschina.org/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: 'all', // 'async' 异步, 'initial' 内部, 'all' 全部
      minSize: 30000, // 大于30KB就分隔打包
      maxSize: 0, // 不限制大小
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      // cacheGroups会继承上面的配置,但是会有自己的单独属性 'test','priority','reuseExistingChunk'
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级,谁数字大,谁优先
          name: 'vendor',
        },
        // 默认规则
        default: {
          minChunks: 2,
          priority: -20, // 优先级
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
    // 把 webpack 的 runtime 启动代码单独抽出一个文件
    runtimeChunk: {
      name: 'runtime',
    },
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
    new AutoDllPlugin({
      context: r('..'),
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name].[hash:8].dll.js',
      path: './assets/js/dll',
      entry: getDllEntry(false),
    }),
    // new AddAssetHtmlPlugin({
    //   filepath: r('../dll/*.dll.js'), // 对应的 dll 文件路径
    //   outputPath: '/assets/js',
    //   publicPath: '/assets/js',
    // }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }),
    // CSS Tree Shaking
    new PurifycssWebpack({
      styleExtensions: ['.css', '.less'],
      paths: glob.sync([
        r('../index.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        r('../src/**/*.js'), // 找到 src 目录下所有 js 文件
      ]),
      purifyOptions: {
        whitelist: ['*purify*'], // 带有 purify 的选择器名字不会被 Tree Shaking, 与 CSS Module 配合时, 请把 CSS Module 名字带有purify关键字
      },
    }),
    new BundleAnalyzerPlugin(),
  ],
});

webpackConfig.module.rules[1]['oneOf'] = [
  getCSSLoader(false), // css的loader
  getLessLoader(false), // less的loader
].concat(webpackConfig.module.rules[1]['oneOf']);

module.exports = webpackConfig;
