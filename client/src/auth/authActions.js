import { push } from 'react-router-redux';
import actionHelpers from '../utils/actionHelpers';
import { SAVE_USER } from './authReducer';

export function saveUser(email, authToken) {
  const userInfo = { email, authToken };
  return { type: SAVE_USER, userInfo };
}

export function authenticateUser(email, password) {
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  return dispatch => fetch('api/login', config)
  .then(actionHelpers.parseJSON)
  .then((response) => {
    dispatch(saveUser(response));
    dispatch(push('/profile'));
  })
  .catch(error => error);
}

export function signUpUser(email, password) {
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  return dispatch => fetch('api/signup', config)
  .then(actionHelpers.parseJSON)
  .then((response) => {
    dispatch(saveUser(response));
    dispatch(push('/profile'));
  })
  .catch(error => error);
}
