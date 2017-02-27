import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import application from './app/appReducer';
import auth from './auth/authReducer';

const appReducer = combineReducers({
  application,
  auth,
  form,
});

export const rootReducer = (state, action) => {
  let newState = state;

  if (action.type === 'USER_LOGOUT') {
    console.log('logging out');
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
