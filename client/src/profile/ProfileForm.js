import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import profileValidation from './profileValidation';

const ProfileForm = ({ handleSubmit, submitting, valid }) => {
  console.log('its render time');
  return (
    <form className="usa-form" onSubmit={handleSubmit}>
      <fieldset>
        <Field
          component={AuthField}
          name="phoneNumber"
          placeholder="Phone number"
          type="tel"
        />
        <div>
          <input
            data-backdrop="static"
            disabled={submitting || !valid}
            type="submit"
            value="Change Phone Number"
          />
        </div>
        <Field
          component="input"
          type="checkbox"
          name="alertEmail"
        />
        <label htmlFor="alertEmail">Send Alerts To Email?</label>
        <Field
          component="input"
          type="checkbox"
          name="alertPhone"
          disabled={!valid}
        />
        <label htmlFor="alertPhone">Text Alerts To Phone?</label>
        <Field
          component="input"
          type="checkbox"
          name="onlyEmergencies"
        />
        <label htmlFor="onlyEmergencies">Only Receive Nofitications For Imminent Emergencies?</label>
      </fieldset>
    </form>
  );
};

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'Profile', // a unique name for this form
  validate: profileValidation,
})(ProfileForm);
