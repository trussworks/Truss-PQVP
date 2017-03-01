import { Map } from 'immutable';
import { SAVE_PROFILE } from '../constants/actionTypes';

const profileReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case SAVE_PROFILE: {
      return state.set('profile', action.userInfo);
    }
    default: {
      return state;
    }
  }
};

export default profileReducer;
