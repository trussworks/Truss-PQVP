import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import app from './app/appReducer';
import auth from './auth/authReducer';
import { USER_LOGOUT } from './constants/actionTypes';
import profile from './profile/profileReducer';

const appReducer = combineReducers({
  app,
  auth,
  form,
  profile,
});

export const rootReducer = (state, action) => {
  let newState = state;

  if (action.type === USER_LOGOUT) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
