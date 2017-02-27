import { Map } from 'immutable';
import * as types from '../constants/actionTypes';

const authReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case types.SAVE_USER: {
      return state.set('user', action.userInfo);
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
