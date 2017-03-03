import actionHelpers from '../utils/actionHelpers';
import { SAVE_PROFILE } from '../constants/actionTypes';
import { displayAlert, dismissAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';

let isUpdating = false;
let nextProfile = null;

export function saveProfile(profile) {
  return { type: SAVE_PROFILE, userInfo: profile };
}

const PROFILE_URL = '/api/profile/';

export function updateProfile(authToken, newProfile) {
  console.log('BEGIN');
  if (isUpdating) {
    // If we are in the middle of a request, just replace nextProfile with newProfile
    nextProfile = newProfile;
    console.log('saving profile999999');
    return saveProfile(newProfile);
  }

  // If we aren't requesting, then we request.
  isUpdating = true;
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${authToken}`);

  const fetchInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(newProfile),
  };

  return (dispatch) => {
    dispatch(saveProfile(newProfile));
    console.log('newporf should be: ', newProfile);
    console.log('sending');
    window.setTimeout(() => {
      console.log('snet');
      fetch(PROFILE_URL, fetchInit)
      .then(actionHelpers.checkStatus)
      .then(actionHelpers.parseJSON)
      .then((profile) => {
        console.log('got back', profile);
        isUpdating = false;
        dispatch(dismissAlert());
        if (nextProfile) {
          const theProfile = nextProfile;
          nextProfile = null;
          // If there was a new profile waiting to be sent, send it.
          console.log('recurse');
          dispatch(updateProfile(authToken, theProfile));
        } else {
          console.log('saving profile!');
          dispatch(saveProfile(profile));
        }
        console.log('back');
      })
      .catch((error) => {
        console.log('errororred');
        isUpdating = false;
        if (error.response.status === 403) {
          // Forbidden means our auth didn't auth
          console.log(error);
          dispatch(logOutUser());
          dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to update your profile. Please login and try again.'));
        } else if (nextProfile) {
          console.error('getProfile Error, retrying: ', error);
          const theProfile = nextProfile;
          nextProfile = null;
          // If there was a new profile waiting to be sent, send it.
          dispatch(updateProfile(theProfile, nextProfile));
        } else {
          dispatch(displayAlert('usa-alert-error', 'Error Loading Profile', 'We were unable to load your profile. Please refresh the page and try again.'));
          console.error('getProfile Final Error: ', error);
        }
      });
    }, 3000);
  };
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
    console.log(error);
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
