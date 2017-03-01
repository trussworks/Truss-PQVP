import React, { PropTypes } from 'react';

const UserMenu = ({ loggedIn, logOutUser, userEmail }) => (
  <li>
    <button
      className="usa-accordion-button usa-nav-link"
      aria-expanded="false"
      aria-controls="side-nav-2"
    >
      <span>{ loggedIn ? userEmail : 'Menu' }</span>
    </button>
    <ul id="side-nav-2" className="usa-nav-submenu">
      <li>
        <a
          href="http://www.cio.ca.gov/"
          rel="noopener noreferrer"
          target="_blank"
        >
          CA Department of Technology
        </a>
      </li>
      <li>
        <a
          href="https://truss.works/"
          rel="noopener noreferrer"
          target="_blank"
        >
          About Truss
        </a>
      </li>
      { loggedIn ?
        (<div>
          <li><a href="" onClick={logOutUser}>Log out</a></li>
        </div>) : (null)
      }
    </ul>
  </li>
);

UserMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
};

export default UserMenu;
