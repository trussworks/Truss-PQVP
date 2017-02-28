import React from 'react';
import 'isomorphic-fetch';
import 'uswds';
import ReactDom, { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Root } from './Root';

require('../styles/main.scss');

const rootElement = document.getElementById('app');

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  rootElement
);

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextApp = require('./Root').default;

    ReactDom.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootElement
    );
  });
}
