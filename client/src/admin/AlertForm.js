import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import alertValidator from './alertValidator';

const AlertForm = ({
  feature,
  featurePicked,
  handleSubmit,
  submitting,
  valid,
}) => (
  <div className="container--span">
    <form onSubmit={handleSubmit}>
      <legend className="legend--has-subtitle">
        <h3>Enter a message describing the event:</h3>
        <span className="text--subtitle">
          Make sure to provide a link to allow the reader to get additional information.
          Single text messages are limited to 160 characters so keep that in mind
          while writing your message and use a link shortener when possible.
        </span>
      </legend>
      { (feature && feature.properties.link) ?
        <div className="container--span">
          <p className="text--subtitle">
          Use the following link provides additional information about the region you selected:
          <br />
            <a href={feature.properties.link}>{feature.properties.link}</a>
          </p>
        </div> : <div />
      }
      <fieldset>
        <div>
          <label htmlFor="alertMessage">Message text:</label>
          <Field
            name="alertMessage"
            component="textarea"
            type="text"
          />
        </div>
        <div>
          <Field
            name="isEmergency"
            component="input"
            type="checkbox"
          />
          <label htmlFor="isEmergency">Is this an immediate emergency?</label>
        </div>
        <input type="submit" disabled={submitting || !(valid && featurePicked)} value="Send Alert!" />
      </fieldset>
    </form>
  </div>
);

AlertForm.propTypes = {
  feature: PropTypes.object,
  featurePicked: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'send-alert',
  validate: alertValidator,
})(AlertForm);
