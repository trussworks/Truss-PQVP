import React, { PropTypes } from 'react';
import onClickOutside from 'react-onclickoutside';
import AdminMenu from './AdminMenu';
import Logo from './Logo';
import UserMenu from './UserMenu';

class NavMenu extends React.Component {
  handleClickOutside() {
    this.menu = document.getElementById('main-menu');
    this.menu.classList.remove('is-visible');
  }
  render() {
    return (
      <div className="container--content group">
        <Logo />
        <nav role="navigation" className="usa-nav" id="main-menu">
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
                <span>{ this.props.loggedIn ? this.props.userEmail : 'About' }</span>
              </button>
              <ul id="side-nav-1" className="usa-nav-submenu">
                <AdminMenu
                  closeMenu={this.props.closeMenu}
                  loggedIn={this.props.loggedIn}
                />
                <UserMenu
                  closeMenu={this.props.closeMenu}
                  loggedIn={this.props.loggedIn}
                  logOutUser={this.props.logOutUser}
                  userEmail={this.props.userEmail}
                />
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

NavMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};

export default onClickOutside(NavMenu);
