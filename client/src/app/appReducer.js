import { Map } from 'immutable';
import * as types from '../constants/actionTypes';

/* Alert Types
*  Alert type should be one of the following USWDS classes:
*  'usa-alert-success', 'usa-alert-warning', usa-alert-error, 'usa-alert-info'
*/

const app = (state = new Map({
  alertHeader: '',
  alertMessage: '',
  alertType: undefined,
}), action) => {
  switch (action.type) {
    case types.DISPLAY_ALERT: {
      const newState = state.withMutations((oldState) => {
        oldState.set('alertType', action.alertType);
        oldState.set('alertHeader', action.alertHeader);
        oldState.set('alertMessage', action.alertMessage);
      });

      return newState;
    }
    case types.DISMISS_ALERT: {
      const newState = state.withMutations((oldState) => {
        oldState.set('alertType', undefined);
        oldState.set('alertHeader', '');
        oldState.set('alertMessage', '');
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};

export default app;
