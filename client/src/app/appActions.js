import * as types from '../constants/actionTypes';

export function dismissAlert() {
  return { type: types.DISMISS_ALERT };
}

/* Alert Types
*  Alert type should be one of the following USWDS classes:
*  'usa-alert-success', 'usa-alert-warning', usa-alert-error, 'usa-alert-info'
*/

export function displayAlert(alertType, alertHeader, alertMessage) {
  return { type: types.DISPLAY_ALERT, alertType, alertHeader, alertMessage };
}
