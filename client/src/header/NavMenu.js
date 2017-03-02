import React, { PropTypes } from 'react';
import AdminMenu from './AdminMenu';
import Logo from './Logo';
import UserMenu from './UserMenu';

const NavMenu = ({ closeMenu, loggedIn, logOutUser, userEmail }) => (
  <div className="container--content group">
    <Logo />
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
            id="side-nav-1-button"
          >
            <span>{ loggedIn ? userEmail : 'About' }</span>
          </button>
          <ul id="side-nav-1" className="usa-nav-submenu">
            <AdminMenu
              closeMenu={closeMenu}
              loggedIn={loggedIn}
            />
            <UserMenu
              closeMenu={closeMenu}
              loggedIn={loggedIn}
              logOutUser={logOutUser}
              userEmail={userEmail}
            />
          </ul>
        </li>
      </ul>
    </nav>
  </div>
);

NavMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};

export default NavMenu;
