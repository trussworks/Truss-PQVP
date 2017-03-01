import React, { PropTypes } from 'react';
import AdminMenu from './AdminMenu';
import Logo from './Logo';
import UserMenu from './UserMenu';

const NavMenu = ({ loggedIn, logOutUser, userEmail }) => (
  <div className="container--content group">
    <Logo />
    <nav role="navigation" className="usa-nav">
      <button className="usa-nav-close">
        <img src="../dist/public/img/close.svg" alt="close" />
      </button>
      <ul className="usa-nav-primary usa-accordion">
        <UserMenu
          loggedIn={loggedIn}
          logOutUser={logOutUser}
          userEmail={userEmail}
        />
        <AdminMenu loggedIn={loggedIn} />
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
