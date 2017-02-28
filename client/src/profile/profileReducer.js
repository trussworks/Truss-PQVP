import { Map } from 'immutable';

export const SAVE_PROFILE = 'SAVE_PROFILE';

const profileReducer = (state = new Map({ user: {} }), action) => {
  switch (action.type) {
    case SAVE_PROFILE: {
      console.log('saving profile');
      return state.set('profile', action.userInfo);
    }
    default: {
      return state;
    }
  }
};

export default profileReducer;
