import { Map } from 'immutable';
import { SAVE_HISTORY } from '../constants/actionTypes';

const adminReducer = (state = new Map({ history: [] }), action) => {
  switch (action.type) {
    case SAVE_HISTORY: {
      return state.set('history', action.history);
    }
    default: {
      return state;
    }
  }
};

export default adminReducer;
