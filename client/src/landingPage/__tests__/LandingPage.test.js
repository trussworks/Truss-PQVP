import React from 'react';
import LandingPage from '../LandingPage';
import renderer from 'react-test-renderer';

test('LandingPage renders', () => {
  fetchMock.get('*', {text: 'hello, PQVP!'});

  const component = renderer.create(
    <LandingPage />
  );

  let tree = component.toJSON();
  expect(tree).toBeDefined();
});
