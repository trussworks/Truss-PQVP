import React, { PropTypes } from 'react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ displayAll, history, toggleAlertFilter }) => (
  <div className="container--half group">
    <input
      type="checkbox"
      id="input--filter"
      name="filter-alerts"
      checked={!displayAll}
      onChange={toggleAlertFilter}
    />
    <label htmlFor="filter-alerts" id="label--filter" >Only show my alerts</label>
    <table className="usa-table-borderless">
      <thead>
        <tr>
          <th scope="col">Sender</th>
          <th scope="col">Message</th>
          <th scope="col">Num. of Recipients</th>
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
  displayAll: PropTypes.bool.isRequired,
  history: PropTypes.array,
  toggleAlertFilter: PropTypes.func.isRequired,
};

export default NotificationsList;
