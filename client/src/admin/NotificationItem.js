import React, { PropTypes } from 'react';

const NotificationsItem = ({ notification }) => (
  <tr>
    <td>{notification.sender}</td>
    <td>{notification.message}</td>
    <td>{notification['send-people']}</td>
  </tr>
);

NotificationsItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationsItem;
