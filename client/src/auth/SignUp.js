import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from './AuthField';
import SignUpValidation from './signUpValidation';

const SignUp = () => {
  const handleSubmit = () => 'Hi';

  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={AuthField}
        label="Email"
        name="email"
        placeholder="Email address"
        type="email"
      />
      <Field
        component={AuthField}
        name="password"
        placeholder="Password"
        type="password"
      />
      <div>
        <button
          data-backdrop="static"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'SignUp', // a unique name for this form
  validate: SignUpValidation,
})(SignUp);
