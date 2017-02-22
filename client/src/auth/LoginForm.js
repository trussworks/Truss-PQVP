import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import authValidation from './authValidation';

const LoginForm = ({ handleSubmit, submitting, valid }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="email">Email</label>
      <Field name="email" component="input" type="email" />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <Field name="password" component="input" type="password" />
    </div>
    <button type="submit" disabled={submitting || !valid}>Sign In</button>
  </form>
  );

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'login',
  validate: authValidation,
})(LoginForm);
