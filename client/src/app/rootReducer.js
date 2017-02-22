import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import application from './appReducer';

const appReducer = combineReducers({
  application,
  form,
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
