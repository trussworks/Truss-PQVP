import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import alertValidator from './alertValidator';

const AlertForm = ({
  feature,
  featurePicked,
  handleSubmit,
  valid,
  sending,
}) => (
  <div className="container--span">
    <form onSubmit={handleSubmit}>
      <legend className="legend--has-subtitle">
        <h3>Enter a message describing the event:</h3>
        <span className="text--subtitle">
          { (feature && feature.properties.link) ? (null) :
          <span>Make sure to provide a link to allow the reader to get additional
          information. </span> }
          Single text messages are limited to 160 characters so keep that in mind
          and use a link shortener when possible.
        </span>
      </legend>
      { (feature && feature.properties.link) ?
        <div className="container--span">
          <p className="text--subtitle">
          The following link provides additional information about the alert you selected:
          <br />
            <a rel="noopener noreferrer" target="_blank" href={feature.properties.link}>{feature.properties.link}</a>
          </p>
        </div> : (null)
      }
      <fieldset>
        <div>
          <label htmlFor="alertMessage">Message text:</label>
          <Field
            name="alertMessage"
            component="textarea"
            type="text"
          />
          <Field
            name="isEmergency"
            component="input"
            type="checkbox"
          />
          <label htmlFor="isEmergency">This event is classified as an emergency.</label>
        </div>
        <input type="submit" disabled={sending || !(valid && featurePicked)} value="Send Alert!" />
      </fieldset>
    </form>
  </div>
);

AlertForm.propTypes = {
  feature: PropTypes.object,
  featurePicked: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  sending: PropTypes.bool,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'send-alert',
  validate: alertValidator,
})(AlertForm);
