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
    dispatch(displayAlert('usa-alert-success', 'Alert Sent!', `Your alert was sent out to ${sentAlert['send-people']} people`));
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
