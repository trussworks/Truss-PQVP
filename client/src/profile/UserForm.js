import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import authValidation from '../auth/authValidation';

const UserForm = ({
  user,
  handleSubmit,
  submitting,
  updatingPassword,
  togglePasswordForm,
  valid,
}) => (
  <div>
    <div>Email Address</div>
    <div>{user.email}</div>
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
            name="confirmPassword"
            placeholder="New password"
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

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  togglePasswordForm: PropTypes.func.isRequired,
  updatingPassword: PropTypes.bool.isRequired,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'ChangePassword', // a unique name for this form
  validate: authValidation,
})(UserForm);
