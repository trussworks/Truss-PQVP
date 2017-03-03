import React, { PropTypes } from 'react';

const NotificationsItem = ({ notification }) => {
  console.log(notification);
  return (
    <tr>
      <td>Hi</td>
      <td>{notification.message}</td>
      <td>{notification.sender}</td>
    </tr>
  );
};

NotificationsItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationsItem;
