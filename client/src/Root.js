import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import { Router, Route, browserHistory } from 'react-router';
import { App } from './app/App';
import { LandingPage } from './landingPage/LandingPage';
import { LoginContainer } from './login/LoginContainer';
import { rootReducer } from './app/rootReducer';

const middleware = routerMiddleware(browserHistory);
const store = createStore(rootReducer, applyMiddleware(thunk, middleware));

export const Root = () => (
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route component={App}>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginContainer} />
      </Route>
    </Router>
  </Provider>
);

export default Root;
