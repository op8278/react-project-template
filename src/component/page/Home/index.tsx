import React from 'react';

import imageSmall from '@assets/images/image-small.png';
import imageBig from '@assets/images/image-big.png';
import styles from './index.less';
import test from './test.css';

interface IProps {
  a: string;
}
const Home: React.FC<IProps> = props => {
  return (
    <div>
      <h1 className={styles.bg}>I am Home Pageds</h1>
      {/* <h1 className={test.a}>I {props.b} caa</h1> */}
      <img src={imageSmall} alt="image-small" />
      <img src={imageBig} alt="image-big" />
    </div>
  );
};

export default Home;
