const { resolve } = require('path');

/**
 *
 * 根据相对路径,返回绝对路径
 * @param {string} path // 相对路径
 * @returns {string}
 */
exports.r = path => {
  return resolve(__dirname, path);
};
