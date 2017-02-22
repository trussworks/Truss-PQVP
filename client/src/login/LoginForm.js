import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

export const LoginForm = reduxForm({
  form: 'login',
})(({ handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="email">Email</label>
      <Field name="email" component="input" type="email" />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <Field name="password" component="input" type="password" />
    </div>
    <button type="submit" disabled={submitting}>Sign In</button>
  </form>
  ));

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default LoginForm;
