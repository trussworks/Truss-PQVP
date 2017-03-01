import { push } from 'react-router-redux';
import actionHelpers from '../utils/actionHelpers';
import { SAVE_PROFILE } from '../constants/actionTypes';

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
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    dispatch(saveProfile(profile));
  }).catch((error) => {
    console.log('caught error');
    console.log(error);
    if (error.isAuthRelatedError) {
      console.log('we failed the auth check, make them login again.');
      dispatch(push('/'));
    }
  });
}

export function getProfile() {
  return dispatch => fetch('/api/profile')
  .then(actionHelpers.parseJSON)
  .then((profile) => {
    dispatch(saveProfile(profile));
  }).catch((error) => {
    console.log('caught error');
    console.log(error);
    if (error.isAuthRelatedError) {
      console.log('we failed the auth check, make them login again.');
      dispatch(push('/'));
    }
  });
}
