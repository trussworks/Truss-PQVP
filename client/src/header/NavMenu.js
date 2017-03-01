import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const NavMenu = ({ loggedIn, logOutUser, userEmail }) => {
  const showAdmin = classnames({
    hide: !loggedIn,
  });

  return (
    <div className="container--content">
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
              aria-controls="side-nav-2"
            >
              <span>{ loggedIn ? userEmail : 'Menu' }</span>
            </button>
            <ul id="side-nav-2" className="usa-nav-submenu">
              <li><a href="http://www.cio.ca.gov/">CA Department of Technology</a></li>
              <li><a href="https://truss.works/">About Truss</a></li>
              { loggedIn ?
                (<div>
                  <li><a href="" onClick={logOutUser}>Log out</a></li>
                </div>) : (null)
              }
            </ul>
          </li>
          <li className={showAdmin}>
            <button
              className="usa-accordion-button usa-nav-link"
              aria-expanded="false"
              aria-controls="side-nav-1"
            >
              <span>Admin</span>
            </button>
            <ul id="side-nav-1" className="usa-nav-submenu">
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/admin/notifications">Notifications</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};

export default NavMenu;
