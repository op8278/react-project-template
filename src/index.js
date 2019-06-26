import { hot } from 'react-hot-loader/root'; // react-hot-loader 一定要在 react,react-dom前面导入, #https://github.com/gaearon/react-hot-loader#getting-started
import React from 'react';
import ReactDOM from 'react-dom';

import '@css/index.less'; // 加载全局less

import Home from '@page/Home';

const $root = document.getElementById('root');

const Root = hot(Home);

ReactDOM.render(<Root />, $root);
