import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const AdminMenu = ({ loggedIn }) => {
  const showAdmin = classnames({
    hide: !loggedIn,
  });

  return (
    <div className={showAdmin}>
      <li><Link to="/admin">Admin Dashboard</Link></li>
      <li><Link to="/admin/notifications">Notifications</Link></li>
    </div>
  );
};

AdminMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default AdminMenu;
