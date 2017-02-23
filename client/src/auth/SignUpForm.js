import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from './AuthField';
import authValidation from './authValidation';

const SignUpForm = ({ handleSubmit, submitting, valid }) => (
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
        disabled={submitting || !valid}
        type="submit"
      >
        Sign Up
      </button>
    </div>
  </form>
);

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'SignUp', // a unique name for this form
  validate: authValidation,
})(SignUpForm);
