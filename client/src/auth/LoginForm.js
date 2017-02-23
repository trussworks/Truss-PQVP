import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import authValidation from './authValidation';
import { AuthField } from '../auth/AuthField';

const LoginForm = ({ handleSubmit, submitting, valid }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Field
        component={AuthField}
        label="Email"
        name="email"
        placeholder="Email address"
        type="email"
      />
    </div>
    <div>
      <Field
        component={AuthField}
        label="Password"
        name="password"
        placeholder="Password"
        type="password"
      />
    </div>
    <button type="submit" disabled={submitting || !valid}>Sign In</button>
  </form>
  );

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'login',
  validate: authValidation,
})(LoginForm);
