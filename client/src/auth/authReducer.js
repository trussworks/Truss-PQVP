import { Map } from 'immutable';

export const SAVE_USER = 'SAVE_USER';

const authReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case SAVE_USER: {
      return state.set('user', action.userInfo);
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
