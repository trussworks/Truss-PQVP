import React, { PropTypes } from 'react';
import { Header } from '../header/Header';

const App = ({ children }) => (
  <div>
    <Header />
    <div>
      {children}
    </div>
  </div>
);

export default App;

App.propTypes = {
  children: PropTypes.element.isRequired,
};
