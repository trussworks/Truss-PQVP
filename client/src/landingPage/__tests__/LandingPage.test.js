import React from 'react';
import LandingPage from '../LandingPage';
import { shallow } from 'enzyme';

test('LandingPage renders', () => {
  it('should render without throwing an error'), () => {
    expect(shallow(<LandingPage />).contains(<h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>)).toBe(true);
  }
});
