import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import authValidation from './authValidation';
import { AuthField } from '../auth/AuthField';

const LoginForm = ({ handleSubmit, submitting, switchForm, valid }) => (
  <form className="usa-form" onSubmit={handleSubmit}>
    <fieldset>
      <legend className="usa-drop_text">Sign in</legend>
      <span>
        or <a href="" onClick={switchForm}>create an account</a>
      </span>
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
      <input type="submit" disabled={submitting || !valid} value="Sign in" />
    </fieldset>
  </form>
  );

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  switchForm: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'login',
  validate: authValidation,
})(LoginForm);
