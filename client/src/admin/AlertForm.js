import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import alertValidator from './alertValidator';

const AlertForm = ({ featurePicked, handleSubmit, submitting, valid }) => (
  <form className="usa-form" onSubmit={handleSubmit}>
    <fieldset>
      <div>
        <label htmlFor="alertMessage">Alert Message</label>
        <Field
          name="alertMessage"
          component="textarea"
          placeholder="Remember to include a link to more information"
          type="text"
        />
      </div>
      <div>
        <label htmlFor="isEmergency">Is this an immdeiate emergency?</label>
        <Field
          name="isEmergency"
          component="input"
          type="checkbox"
        />
      </div>
      <input type="submit" disabled={submitting || !(valid && featurePicked)} value="Send Alert!" />
    </fieldset>
  </form>
);

AlertForm.propTypes = {
  featurePicked: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'send-alert',
  validate: alertValidator,
})(AlertForm);
