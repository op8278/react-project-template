import React from 'react';

import imageSmall from '@assets/images/image-small.png';
import imageBig from '@assets/images/image-big.png';
import styles from './index.less';
import test from './test.css';

const Home = props => {
  // if (true) {
  //   React.useEffect(() => {
  //     //
  //   });
  // }

  return (
    <div>
      <h1 className={styles.bg}>I am Home Page</h1>
      <img src={imageSmall} alt="image-small" />
      <img src={imageBig} alt="image-big" />
    </div>
  );
};

export default Home;
