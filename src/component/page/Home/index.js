import React from 'react';

import styles from './index.less';
import test from './test.css';
console.log(styles);
console.log(test);

const Home = () => {
  return <div className={styles.bg}> i am Home Page</div>;
};

export default Home;
