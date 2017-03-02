import React, { PropTypes } from 'react';
import HeaderContainer from '../header/HeaderContainer';
import Footer from '../footer/Footer';

const App = ({ children }) => (
  <div>
    <HeaderContainer />
    <div className="group">
      {children}
    </div>
    <Footer />
  </div>
);

export default App;

App.propTypes = {
  children: PropTypes.element.isRequired,
};
