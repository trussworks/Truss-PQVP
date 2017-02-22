import { SAVE_USER } from './loginReducer';

export function saveUser(email, authToken) {
  const userInfo = { email, authToken };
  return { type: SAVE_USER, userInfo };
}

export function authenticateUser(email, password) {
  console.log('Authenticating User!');
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };
  console.log(config);

  return (dispatch) => {
    console.log('we dispatching');
    fetch('/hello/there')
      .then((response) => {
        console.log('got back from login');
        console.log(response);

        const userMessage = saveUser(email, 'DEADBEEF');
        console.log(userMessage);

        dispatch(userMessage);
        return response;
      })
      .catch(error => error);
  };
}
