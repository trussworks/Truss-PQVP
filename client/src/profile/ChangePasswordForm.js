import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import authValidation from '../auth/authValidation';

const ChangePasswordForm = ({
  handleSubmit,
  submitting,
  updatingPassword,
  togglePasswordForm,
  valid
}) => (
  <div>
    <a href="" onClick={togglePasswordForm}>Change password</a>
    {updatingPassword ?
      (<form className="usa-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="usa-drop_text">Reset password</legend>
          <span className="usa-serif">Please enter your new password</span>
          <Field
            component={AuthField}
            label="New password"
            name="password"
            placeholder="New password"
            type="password"
          />
          <Field
            component={AuthField}
            label="Confirm password"
            name="password"
            placeholder="Old password"
            type="password"
          />
          <input
            data-backdrop="static"
            disabled={submitting || !valid}
            type="submit"
            value="Reset password"
          />
        </fieldset>
      </form>) : (null)
    }
  </div>
);

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  togglePasswordForm: PropTypes.func.isRequired,
  updatingPassword: PropTypes.bool.isRequired,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'ChangePassword', // a unique name for this form
  validate: authValidation,
})(ChangePasswordForm);
