import { Map } from 'immutable';
import * as types from '../constants/actionTypes';

const authReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case types.SAVE_USER: {
      const newState = state.withMutations((oldState) => {
        oldState.set('email', action.userInfo.email);
        oldState.set('accessToken', action.userInfo.access_token);
        oldState.set('expiresIn', action.userInfo.expires_in);
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
