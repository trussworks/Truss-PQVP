import { push } from 'react-router-redux';

import { SAVE_USER } from './authReducer';

export function saveUser(email, authToken) {
  const userInfo = { email, authToken };
  return { type: SAVE_USER, userInfo };
}

export function authenticateUser(email, password) {
  return dispatch => fetch(`/hello/${password}`)
    .then(response => response.text())
    .then((text) => {
      dispatch(saveUser(email, text));
      dispatch(push('/profile'));
    })
    .catch(error => error);
}

export function signUpUser(email, password) {
  return dispatch => fetch(`/hello/${password}`)
    .then(response => response.text())
    .then((text) => {
      dispatch(saveUser(email, text));
      dispatch(push('/profile'));
    })
    .catch(error => error);
}
