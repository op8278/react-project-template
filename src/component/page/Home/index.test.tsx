import React from 'react';
import { shallow } from 'enzyme';

import Component from './index';

describe('Home', () => {
  test('should render', () => {
    const component = shallow(<Component />);
    expect(component.exists()).toBeTruthy();
  });
  test('should render correctly', () => {
    const component = shallow(<Component />);
    const div = component.find('div');
    const h1 = component.find('h1').first();
    const imgs = component.find('img');
    expect(div.length).toBe(1);
    expect(h1.hasClass('bg')).toBeTruthy();
    expect(imgs.at(0).props()).toEqual({
      src: 'image-small.png',
      alt: 'image-small',
    });
    expect(imgs.at(1).props()).toEqual({
      src: 'image-big.png',
      alt: 'image-big',
    });
  });
});
