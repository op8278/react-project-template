const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
