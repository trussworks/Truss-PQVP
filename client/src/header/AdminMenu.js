import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const AdminMenu = ({ loggedIn }) => {
  const showAdmin = classnames({
    hide: !loggedIn,
  });

  return (
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
  );
};

AdminMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default AdminMenu;
