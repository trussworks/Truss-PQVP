import React, { PropTypes } from 'react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ history }) => (
  <div className="container--half">
    <table className="usa-table-borderless">
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">Description</th>
          <th scope="col">Sender</th>
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
