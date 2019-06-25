const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');

/**
 *
 * 根据相对路径,返回绝对路径
 * @param {string} path // 相对路径
 * @returns {string}
 */
exports.r = path => {
  return resolve(__dirname, path);
};

/**
 *
 * 获取和样式相关的loaders
 * @param {object} cssOptions // css-loader的option
 * @param {string} preProcessor // 第一个(css预语言)执行的loader名字
 * @param {boolean} isEnvDevelopment // 是否dev开发环境
 * @returns {array} // loders数组
 */
exports.getStyleLoaders = (cssOptions, preProcessor, isEnvDevelopment = true) => {
  const loaders = [
    isEnvDevelopment && 'style-loader',
    !isEnvDevelopment && {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: 'postcss-loader',
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: true,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: preProcessor + '',
      options: {
        sourceMap: true,
        modules: true,
      },
    });
  }
  return loaders;
};
