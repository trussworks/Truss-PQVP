import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from './AuthField';
import authValidation from './authValidation';

const SignUpForm = ({ handleSubmit, submitting, switchForm, valid }) => (
  <form className="usa-form" onSubmit={handleSubmit}>
    <fieldset>
      <legend className="usa-drop_text">Sign up</legend>
      <span>
        or <a href="" onClick={switchForm}>log in with an existing account</a>
      </span>
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
        <input
          data-backdrop="static"
          disabled={submitting || !valid}
          type="submit"
          value="Sign up"
        />
      </div>
    </fieldset>
  </form>
);

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  switchForm: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'SignUp', // a unique name for this form
  validate: authValidation,
})(SignUpForm);
