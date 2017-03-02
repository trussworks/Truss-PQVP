import React from 'react';

const NotificationsPage = () => (
  <div className="container--content">
    <h1>Notifications</h1>
    <table className="usa-table-borderless">
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">Description</th>
          <th scope="col">Sender</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Declaration of Independence</th>
          <td>Statement adopted by the Continental Congress declaring indepen</td>
          <td>1776</td>
        </tr>
        <tr>
          <th scope="row">Bill of Rights</th>
          <td>The first ten ranteeing rights and freedoms.</td>
          <td>1791</td>
        </tr>
        <tr>
          <th scope="row">Declaration of Sentiments</th>
          <td>MadeA document written during the Seneca Falls Convention outl</td>
          <td>1848</td>
        </tr>
        <tr>
          <th scope="row">Emancipation Proclamation</th>
          <td>An executive order grantingnated southern states.</td>
          <td>1863</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default NotificationsPage;
