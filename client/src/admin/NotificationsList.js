import React, { PropTypes } from 'react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ history }) => (
  <div className="container--half">
    <table className="usa-table-borderless">
      <thead>
        <tr>
          <th scope="col">Message</th>
          <th scope="col">Sender</th>
          <th scope="col">Alerts Sent</th>
        </tr>
      </thead>
      <tbody>
        { history.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))}
      </tbody>
    </table>
  </div>
);

NotificationsList.propTypes = {
  history: PropTypes.array,
};

export default NotificationsList;
