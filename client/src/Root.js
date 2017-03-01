import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import App from './app/App';
import LandingPage from './landingPage/LandingPage';
import ProfileContainer from './profile/ProfileContainer';
import requireAuth from './auth/requireAuth';
import { rootReducer } from './rootReducer';
import AdminPage from './admin/AdminPage';
import NotificationsPage from './admin/NotificationsPage';
import authPersistence from './auth/authPersistence';

const middleware = routerMiddleware(browserHistory);
const store = createStore(rootReducer, applyMiddleware(thunk, middleware));
authPersistence(store);

export const Root = () => (
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route component={App}>
        <Route path="/" component={LandingPage} />
        <Route path="profile" component={requireAuth(ProfileContainer)} />
      </Route>
      <Route path="admin" component={App}>
        <IndexRoute component={requireAuth(AdminPage)} />
        <Route path="notifications" component={requireAuth(NotificationsPage)} />
      </Route>
    </Router>
  </Provider>
);

export default Root;
