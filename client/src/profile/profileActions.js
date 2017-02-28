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
      response.text().then((profile) => {
        console.log('heres a profile');
        console.log(profile);
        const fakeprofile = {
          phoneNumber: '6154180745',
          alertEmail: true,
          alertPhone: true,
          onlyEmergencies: true,
          addresses: [
          // addresses should just be GEOJSON
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-122.423909, 37.746034],
              },
              properties: {
                label: '175 Duncan St, San Francisco, CA, USA',
                name: '175 Duncan St',
              },
            },
          ],
        };

        console.log('setting profile: ');
        console.log(fakeprofile);
        dispatch(saveProfile(fakeprofile));
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
