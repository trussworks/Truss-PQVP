import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import application from './app/appReducer';
import auth from './auth/authReducer';

export const rootReducer = combineReducers({
  application,
  auth,
  form,
});

export default rootReducer;
