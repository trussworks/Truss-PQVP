import { SAVE_USER } from './loginReducer';

export function saveUser(email, authToken) {
  const userInfo = { email, authToken };
  return { type: SAVE_USER, userInfo };
}

export function authenticateUser(email, password) {
  return dispatch => fetch(`/hello/${password}`)
    .then(response => response.text())
    .then((text) => {
      dispatch(saveUser(email, text));
      return response;
    })
    .catch(error => error);
}
