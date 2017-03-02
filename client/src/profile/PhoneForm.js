import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { AuthField } from '../auth/AuthField';
import profileValidation from './profileValidation';

const PhoneForm = ({ handleSubmit }) => (
  <form
    className="feature--disabled usa-form form--inline"
    onSubmit={handleSubmit}
  >
    <fieldset>
      <legend><h3>Update phone number</h3></legend>
      <Field
        component={AuthField}
        name="phone"
        placeholder="Phone number"
        type="tel"
      />
      <div>
        <input
          data-backdrop="static"
          type="submit"
          value="Update"
        />
      </div>
    </fieldset>
  </form>
);

PhoneForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'Profile', // a unique name for this form
  validate: profileValidation,
})(PhoneForm);
