import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import profileValidation from './profileValidation';

const AlertSettingsForm = ({ handleSubmit, valid }) => (
  <div className="container--right">
    <form className="usa-form" id="form--notification" onSubmit={handleSubmit}>
      <fieldset>
        <legend><h3>Notification Settings</h3></legend>
        <Field
          component="input"
          type="checkbox"
          name="alertEmail"
          onChange={() => {
            setTimeout(handleSubmit);
          }}
        />
        <label htmlFor="alertEmail">Send Alerts To Email?</label>
        <Field
          component="input"
          type="checkbox"
          name="alertPhone"
          disabled={!valid}
          onChange={() => {
            setTimeout(handleSubmit);
          }}
        />
        <label htmlFor="alertPhone">Text Alerts To Phone?</label>
        <Field
          component="input"
          type="checkbox"
          name="onlyEmergencies"
          onChange={() => {
            setTimeout(handleSubmit);
          }}
        />
        <label htmlFor="onlyEmergencies">Only Receive Notifications For Imminent Emergencies?</label>
      </fieldset>
    </form>
  </div>
);

AlertSettingsForm.propTypes = {
  handleSubmit: PropTypes.func,
  valid: PropTypes.bool,
};

export default reduxForm({
  form: 'Profile', // a unique name for this form
  validate: profileValidation,
})(AlertSettingsForm);
