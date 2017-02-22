import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import application from './appReducer';
import login from '../login/loginReducer';

export const rootReducer = combineReducers({
  application,
  login,
  form,
});

export default rootReducer;
