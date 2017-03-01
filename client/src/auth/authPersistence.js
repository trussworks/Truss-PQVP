import { saveUser } from './authActions';

function authPersistence(store) {
  // User State Restoration.
  const savedUser = localStorage.getItem('userInfo');
  if (savedUser) {
    store.dispatch(saveUser(JSON.parse(savedUser)));
  }

  let oldUser = {};
  store.subscribe(() => {
    const authState = store.getState().auth;
    const newUser = {
      email: authState.get('email'),
      access_token: authState.get('accessToken'),
      expires_in: authState.get('expiresIn'),
    };
    if (!(oldUser.email === newUser.email && oldUser.access_token === newUser.access_token)) {
      console.log('writing to local storage', newUser);
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }
    oldUser = newUser;
  });
}

export default authPersistence;
