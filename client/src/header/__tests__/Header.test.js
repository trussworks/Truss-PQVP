import React from 'react';
import Header from '../HeaderContainer';
import { shallow } from 'enzyme';

test('HeaderContainer renders', () => {
  it('should render without throwing an error'), () => {
    expect(shallow(<HeaderContainer />).contains(<h1>The Emergency Alert App HeaderContainer</h1>)).toBe(true);
  }
});
