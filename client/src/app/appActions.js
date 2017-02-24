import * as types from '../constants/actionTypes';

export function dismissAlert() {
  return { type: types.DISMISS_ALERT };
}

export function displayAlert(alertType, header, message) {
  return { type: types.DISPLAY_ALERT, alertType, header, message };
}
