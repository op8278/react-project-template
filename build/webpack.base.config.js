const webpack = require('webpack');

const { r, createHappyPlugin } = require('./util');

const plugins = [];

// try {
//   // 判断之前是否生成过 dll 文件
//   if (require.resolve('../dll/react.manifest.json')) {
//     plugins.push(
//       new webpack.DllReferencePlugin({
//         context: r('..'),
//         manifest: r('../dll/react.manifest.json'),
//       })
//     );
//   }
// } catch (error) {
//   console.log('未找到 dll/react.manifest.json 文件');
// }

const webpackConfig = {
  // 入口文件
  entry: {
    app: [r('../src/index.js')],
  },
  // 输出文件
  output: {
    path: r('../dist'),
    publicPath: '/',
  },

  resolve: {
    // 省略后缀
    extensions: [
      '.web.mjs',
      '.mjs',
      '.web.js',
      '.js',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json',
      '.web.jsx',
      '.jsx',
    ],

    // import快捷路径
    alias: {
      '@assets': r('../assets'),
      '@common': r('../src/common'),
      '@util': r('../src/common/util'),
      '@api': r('../src/common/api'),
      '@component': r('../src/component'),
      '@css': r('../src/css'),
      '@dumb': r('../src/component/dumb'),
      '@page': r('../src/component/page'),
      '@smart': r('../src/component/smart'),
    },
  },
  // 资源加载loader
  module: {
    rules: [
      {},
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // babel的loader
          {
            test: /\.(jsx|js)$/,
            loader: 'happypack/loader?id=happy-babel',
            exclude: r('../node_modules/'),
            include: r('../src/'),
          },

          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: 'url-loader',
            options: {
              limit: 10000, // 大小超过limit就抽出来,变成单独的文件,否则就以base64的形式嵌入标签中
              outputPath: 'assets/images',
              name: '[name].[hash:base64:8].[ext]',
            },
          },
          // 处理字体文件
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts',
              name: '[name].[hash:base64:8].[ext]',
            },
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: 'file-loader',
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              outputPath: 'assets/files',
              name: '[name].[hash:base64:8].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    createHappyPlugin('happy-babel', [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 启用缓存
        },
      },
    ]),
    ...plugins,
  ],
};
module.exports = webpackConfig;
