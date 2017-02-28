import React, { PropTypes } from 'react';
import HeaderContainer from '../header/HeaderContainer';

const App = ({ children }) => (
  <div>
    <HeaderContainer />
    <div>
      {children}
    </div>
  </div>
);

export default App;

App.propTypes = {
  children: PropTypes.element.isRequired,
};
