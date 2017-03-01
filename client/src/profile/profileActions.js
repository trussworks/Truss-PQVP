import { push } from 'react-router-redux';
import actionHelpers from '../utils/actionHelpers';
import { SAVE_PROFILE } from '../constants/actionTypes';
import { displayAlert, dismissAlert } from '../app/appActions';

export function saveProfile(profile) {
  return { type: SAVE_PROFILE, userInfo: profile };
}

export function updateProfile(newProfile) {
  const headers = new Headers();
  // TODO: add the security to our headers.
  const fetchInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(newProfile),
  };

  return dispatch => fetch('/api/profile', fetchInit)
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    dispatch(saveProfile(profile));
    dispatch(dismissAlert());
  })
  .catch((error) => {
    dispatch(displayAlert('usa-alert-error', 'Error Saving Profile', 'We were unable to save your profile. Please refresh the page and try again.'));
    console.error('updateProfile Error: ', error);
    if (error.isAuthRelatedError) {
      console.log('we failed the auth check, make them login again.');
      dispatch(push('/'));
    }
  });
}

export function getProfile() {
  return dispatch => fetch('/api/profile')
  .then(actionHelpers.checkStatus)
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    dispatch(saveProfile(profile));
    dispatch(dismissAlert());
  })
  .catch((error) => {
    dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to load your profile. Please refresh the page and try again.'));
    console.error('getProfile Error: ', error);
    if (error.isAuthRelatedError) {
      console.log('we failed the auth check, make them login again.');
      dispatch(push('/'));
    }
  });
}
