import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const AdminMenu = ({ closeMenu, loggedIn }) => {
  const showAdmin = classnames({
    hide: !loggedIn,
  });

  return (
    <div className={showAdmin}>
      <li>
        <Link onClick={closeMenu} to="/admin">
          Admin Dashboard
        </Link>
      </li>
      <li>
        <Link onClick={closeMenu} to="/admin/notifications">
          Notifications
        </Link>
      </li>
    </div>
  );
};

AdminMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default AdminMenu;
