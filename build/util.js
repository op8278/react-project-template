const { resolve } = require('path');
const os = require('os');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

// eslint-disable-next-line new-cap
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 }); // 进程池,本机最大 cpu 数 - 1

/**
 *
 * 根据相对路径,返回绝对路径
 * @param {string} path // 相对路径
 * @returns {string}
 */
const r = path => {
  return resolve(__dirname, path);
};

/**
 *
 * 获取和样式相关的loaders
 * @param {object} cssOptions // css-loader的option
 * @param {string} preProcessor // 第一个(css预语言)执行的loader名字
 * @param {boolean} isEnvDevelopment // 是否dev开发环境
 * @returns {array} // loaders数组
 */
const getStyleLoaders = (cssOptions, preProcessor, isEnvDevelopment = true) => {
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
/**
 *
 * 获取css-loader对象配置
 * @param {boolean} isEnvDevelopment // 是否dev开发环境
 * @param {boolean} isUseModules // 是否启动 css modules, 把变量名打乱
 * @returns {object} // css-loader的配置
 */
const getCSSLoader = (isEnvDevelopment = true, isUseModules = true) => {
  const cssOptions = {};

  if (isUseModules) {
    cssOptions['modules'] = {
      localIdentName: 'purify_[hash:base64:5]',
    };
  }

  return {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: getStyleLoaders(
      {
        importLoaders: 1,
        sourceMap: true,
        ...cssOptions,
      },
      null,
      isEnvDevelopment
    ),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  };
};
/**
 *
 * 获取less-loader对象配置
 * @param {boolean} isEnvDevelopment // 是否dev开发环境
 * @param {boolean} isUseModules // 是否启动 css modules, 把变量名打乱
 * @returns {object} // less-loader的配置
 */
const getLessLoader = (isEnvDevelopment = true, isUseModules = true) => {
  const cssOptions = {};

  if (isUseModules) {
    cssOptions['modules'] = {
      localIdentName: 'purify_[hash:base64:5]',
    };
  }
  return {
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders(
      {
        importLoaders: 2,
        sourceMap: true,
        ...cssOptions,
      },
      'less-loader',
      isEnvDevelopment
    ),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  };
};
/**
 *
 * 获取 autodll-webpack-plugin 的 entry 配置
 * @param {boolean} isEnvDevelopment // 是否dev开发环境
 * @returns {object} // autodll-webpack-plugin 的 entry 的配置
 */
const getDllEntry = (isEnvDevelopment = true) => {
  return {
    // 需要打包成 dll 文件的库列表
    react: ['react', isEnvDevelopment ? '@hot-loader/react-dom' : 'react-dom'],
  };
};
/**
 *
 * 创建 happyPack 的 plugin 配置
 * @param {string} id // happyPack 定位的 id
 * @param {array} loaders // loaders
 * @returns {object}
 */
const createHappyPlugin = (id, loaders) => {
  return new HappyPack({
    id: id, // id
    loaders: loaders, // loaders
    threadPool: happyThreadPool, // 共享进程池
  });
};
module.exports = {
  r,
  getStyleLoaders,
  getCSSLoader,
  getLessLoader,
  getDllEntry,
  createHappyPlugin,
};
