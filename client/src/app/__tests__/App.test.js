import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';

test('App renders', () => {
  fetchMock.get('*', {text: 'hello, PQVP!'});

  const component = renderer.create(
    <App />
  );

  let tree = component.toJSON();
  expect(tree).toBeDefined();
});
