import React from 'react';
import NotificationsList from './NotificationsList';
import NotificationsMap from './NotificationsMap';

const NotificationsPage = () => (
  <div className="container--content">
    <h1 className="text--center text__margin--70">Notifications</h1>
    <NotificationsMap />
    <NotificationsList />
  </div>
);

export default NotificationsPage;
