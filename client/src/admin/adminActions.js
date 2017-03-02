import actionHelpers from '../utils/actionHelpers';
import { displayAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';

export function postAlert(authToken, alert) {
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
    console.log('alert sent!', sentAlert); // this is not being sent back correctly right now. Expect to get the number alerted.
    dispatch(displayAlert('', 'Alert Sent!', 'Your alert was sent out to MAYBE PEOPLE'));
  })
  .catch((error) => {
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

export default postAlert;
