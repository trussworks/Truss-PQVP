import React, { PropTypes } from 'react';

const NavMenu = ({ loggedIn, logOutUser, userEmail }) => (
  <div>
    <div className="usa-navbar">
      <button className="usa-menu-btn">Menu</button>
      <div className="usa-logo" id="logo">
        <em className="usa-logo-text">
          <a href="" title="Home" aria-label="Home">Emergency Alert App</a>
        </em>
      </div>
    </div>
    <nav role="navigation" className="usa-nav">
      <button className="usa-nav-close">
        <img src="../dist/public/img/close.svg" alt="close" />
      </button>
      <ul className="usa-nav-primary usa-accordion">
        <li>
          <button
            className="usa-accordion-button usa-nav-link"
            aria-expanded="false"
            aria-controls="side-nav-1"
          >
            <span>{ loggedIn ? userEmail : 'Menu' }</span>
          </button>
          <ul id="side-nav-1" className="usa-nav-submenu">
            <li><a href="http://www.cio.ca.gov/">CA Department of Technology</a></li>
            <li><a href="https://truss.works/">About Truss</a></li>
            <li>
              { loggedIn ?
                (<a href="" onClick={logOutUser}>Log out</a>) : (null)
              }
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
);

NavMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};

export default NavMenu;
