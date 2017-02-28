import { push } from 'react-router-redux';

import { SAVE_PROFILE } from './profileReducer';

export function saveProfile(profile) {
  return { type: SAVE_PROFILE, userInfo: profile };
}

export function updateProfile(newProfile) {
  console.log(newProfile);
  const headers = new Headers();
  // TODO: add the security to our headers.
  const fetchInit = { method: 'POST',
    headers,
    body: JSON.stringify(newProfile),
  };

  return dispatch => fetch('/api/profile', fetchInit).then((response) => {
    if (!response.ok) {
      console.log('we got an error back trying to get a profile');
      // insert code to display error to user.
    } else {
      console.log('got back a good profile');
      response.text().then((profile) => {
        console.log('heres a profile');
        console.log(profile);

        console.log('setting profile: ');
        console.log(newProfile);
        dispatch(saveProfile(newProfile));
      });
    }
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
  return dispatch => fetch('/api/profile').then((response) => {
    if (!response.ok) {
      console.log('we got an error back trying to get a profile');
      // insert code to display error to user.
    } else {
      console.log('got back a good profile');
      response.json().then((profile) => {
        console.log('heres a profile');
        console.log(profile);
        dispatch(saveProfile(profile));
      });
    }
  }).catch((error) => {
    console.log('caught error');
    console.log(error);
    if (error.isAuthRelatedError) {
      console.log('we failed the auth check, make them login again.');
      dispatch(push('/'));
    }
  });
}
