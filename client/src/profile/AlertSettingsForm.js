import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import profileValidation from './profileValidation';

const AlertSettingsForm = ({ handleSubmit, valid }) => (
  <div className="container--right">
    <div className="container--collapse">
      <form className="usa-form container--blue" onSubmit={handleSubmit}>
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
          <label htmlFor="alertEmail">Subscribe to Email Alerts</label>
          <Field
            component="input"
            type="checkbox"
            name="alertPhone"
            disabled={!valid}
            onChange={() => {
              setTimeout(handleSubmit);
            }}
          />
          <label htmlFor="alertPhone">Subscribe to Text Alerts</label>
          <Field
            component="input"
            type="checkbox"
            name="onlyEmergencies"
            onChange={() => {
              setTimeout(handleSubmit);
            }}
          />
          <label htmlFor="onlyEmergencies">Only Receive Emergency Notifications</label>
        </fieldset>
      </form>
    </div>
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
