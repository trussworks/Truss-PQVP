import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import application from './appReducer';

const reducers = combineReducers({
  application,
  form,
});

const rootReducer = (state, action) => reducers(state, action);

export default rootReducer;
