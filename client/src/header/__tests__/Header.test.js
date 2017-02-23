import React from 'react';
import Header from '../Header';
import { shallow } from 'enzyme';

test('Header renders', () => {
  it('should render without throwing an error'), () => {
    expect(shallow(<Header />).contains(<h1>The Emergency Alert App Header</h1>)).toBe(true);
  }
});
