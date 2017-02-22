import { Map } from 'immutable';

const application = (state = new Map({
}), action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default application;
