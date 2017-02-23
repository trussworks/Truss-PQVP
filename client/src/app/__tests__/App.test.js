import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';

test('App renders', () => {
  it('should render without throwing an error'), () => {
    expect(shallow(<App />).contains(<Header />)).toBe(true);
  }
});
