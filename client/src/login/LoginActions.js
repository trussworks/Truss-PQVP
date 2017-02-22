import { SAVE_USER } from './loginReducer';

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
  console.log(config); // silence the warning until we are actually hitting an endpoint

  return (dispatch) => {
    fetch('/hello/there')
      .then((response) => {
        const userMessage = saveUser(email, response);

        dispatch(userMessage);
        return response;
      })
      .catch(error => error);
  };
}
