import authValidation from '../authValidation';

describe('Auth validation', () => {
  it('should return an error if there is no email', () => {
    const userValues = {
      password: 'password'
    };

    expect(authValidation(userValues)).toEqual({'email': 'Required'});

  });

  it('should throw an error for an invalid email', () => {
    const userValues = {
      email: 'email',
      password: 'password'
    };

    expect(authValidation(userValues)).toEqual({'email': 'Invalid email address'});

  });

  it('should throw an error if there is no password', () => {
    const userValues = {
      email: 'email@test.com',
    };

    expect(authValidation(userValues)).toEqual({'password': 'Required'});

  });
});
