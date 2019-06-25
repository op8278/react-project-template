const { r } = require('./util')

const webpackConfig = {
  // 输出文件
  output: {
    path: r('../dist'),
    publicPath: '/public/',
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
      '@common': r('../src/common'),
      '@util': r('../src/common/util'),
      '@api': r('../src/common/api'),
      '@compoent': r('../src/compoent'),
      '@dumb': r('../src/compoent/dumb'),
      '@page': r('../src/compoent/page'),
      '@smart': r('../src/compoent/smart'),
      'react-dom': '@hot-loader/react-dom', // #https://github.com/gaearon/react-hot-loader#react--dom
    },
  },
  // 资源加载loader
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: r('../node_modules/'),
        include: r('../src/'),
      },
    ],
  },
}
module.exports = webpackConfig
