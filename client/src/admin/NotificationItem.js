import React, { PropTypes } from 'react';

const NotificationsItem = ({ notification }) => (
  <tr>
    <td>{notification.message}</td>
    <td>{notification.sender}</td>
  </tr>
);

NotificationsItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationsItem;