import actionHelpers from '../utils/actionHelpers';
import { displayAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';
import { SAVE_HISTORY } from '../constants/actionTypes';

export function saveHistory(history) {
  return { type: SAVE_HISTORY, history };
}

export function postAlert(authToken, alert, callback) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${authToken}`);

  const fetchInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(alert),
  };

  return dispatch => fetch('/api/alert/', fetchInit)
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((sentAlert) => {
    dispatch(displayAlert('usa-alert-success', 'Alert Sent!', `Your alert was sent out to ${sentAlert['send-people']} people`));
    callback();
    window.scrollTo(0, 0);
  })
  .catch((error) => {
    callback();
    if (error.response.status === 403) {
      // Forbidden means our auth didn't auth
      dispatch(logOutUser());
      dispatch(displayAlert('usa-alert-error', 'Error Sending Alert', 'We were unable to send the alert. Please login and try again.'));
    } else {
      dispatch(displayAlert('usa-alert-error', 'Error Sending Alert', 'We were unable to send the alert. Please refresh the page and try again.'));
      console.error('postAlert Error: ', error);
    }
  });
}

export function fetchHistory(accessToken) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);

  const fetchInit = {
    method: 'GET',
    headers,
  };

  return dispatch => fetch('/api/alert/history', fetchInit)
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((response) => {
    dispatch(saveHistory(response));
  })
  .catch((error) => {
    console.error(error);
  });
}
