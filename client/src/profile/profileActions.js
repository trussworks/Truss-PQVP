import actionHelpers from '../utils/actionHelpers';
import { SAVE_PROFILE } from '../constants/actionTypes';
import { displayAlert, dismissAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';

export function saveProfile(profile) {
  return { type: SAVE_PROFILE, userInfo: profile };
}

const PROFILE_URL = '/api/profile/';

export function updateProfile(authToken, newProfile) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${authToken}`);

  const fetchInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(newProfile),
  };

  return dispatch => fetch(PROFILE_URL, fetchInit)
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    dispatch(saveProfile(profile));
    dispatch(dismissAlert());
  })
  .catch((error) => {
    if (error.response.status === 403) {
      // Forbidden means our auth didn't auth
      dispatch(logOutUser());
      dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to update your profile. Please login and try again.'));
    } else {
      dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to load your profile. Please refresh the page and try again.'));
      console.error('getProfile Error: ', error);
    }
  });
}

export function getProfile(authToken) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${authToken}`);
  const fetchInit = {
    method: 'GET',
    headers,
  };

  return dispatch => fetch(PROFILE_URL, fetchInit)
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    const newProfile = Object.assign({}, profile);
    if (!newProfile.addresses) {
      newProfile.addresses = [];
    }
    dispatch(saveProfile(newProfile));
    dispatch(dismissAlert());
  })
  .catch((error) => {
    console.log(error.response.status);
    console.log(error.response);
    if (error.response.status === 403) {
      // Forbidden means our auth didn't auth
      dispatch(logOutUser());
      dispatch(displayAlert('usa-alert-error', 'Logged Out', 'You have been logged out. Please login again to continue.'));
    } else {
      dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to load your profile. Please refresh the page and try again.'));
      console.error('getProfile Error: ', error);
    }
  });
}
