import React, { PropTypes } from 'react';

export const AuthField = ({ input, placeholder, type }) => (
  <div>
    <div>
      <label htmlFor="input-type-text">{placeholder}</label>
      <input
        placeholder={placeholder}
        type={type}
        {...input}
      />
    </div>
  </div>
);

AuthField.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default AuthField;
