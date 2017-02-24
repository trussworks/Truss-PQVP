import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import authValidation from '../auth/authValidation';

const ProfileForm = ({ handleSubmit, submitting, valid }) => (
  <form className="usa-form" onSubmit={handleSubmit}>
    <fieldset>
      <legend className="usa-drop_text">Update your profile</legend>
      <Field
        component={AuthField}
        label="Email"
        name="email"
        placeholder="Email address"
        type="email"
      />
      <Field
        component={AuthField}
        name="phone"
        placeholder="Phone number"
        type="tel"
      />
      <div>
        <input
          data-backdrop="static"
          disabled={submitting || !valid}
          type="submit"
          value="Update"
        />
      </div>
    </fieldset>
  </form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'Profile', // a unique name for this form
  validate: authValidation,
})(ProfileForm);
