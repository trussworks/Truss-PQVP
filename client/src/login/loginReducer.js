import { Map } from 'immutable';

export const SAVE_USER = 'SAVE_USER';

const loginReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case SAVE_USER: {
      return state.set('user', action.userInfo);
    }
    default: {
      return state;
    }
  }
};

export default loginReducer;
