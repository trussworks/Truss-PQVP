import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import authValidation from '../auth/authValidation';

const UserForm = ({
  handleSubmit,
}) => (
  <form className="usa-form form--inline" onSubmit={handleSubmit}>
    <fieldset>
      <img
        alt="This feature is not yet implemented"
        className="icon--disabled"
        src="./dist/public/img/work-in-progress.png"
      />
      <legend><h3>Reset password</h3></legend>
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
        disabled
        type="submit"
        value="Reset password"
      />
    </fieldset>
  </form>
);

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'ChangePassword', // a unique name for this form
  validate: authValidation,
})(UserForm);
