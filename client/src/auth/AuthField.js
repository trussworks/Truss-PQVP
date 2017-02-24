import React, { PropTypes } from 'react';

export const AuthField = ({ input, placeholder, name, type }) => (
  <div>
    <div>
      <label htmlFor={name}>{placeholder}</label>
      <input
        autoCapitalize="off"
        autoCorrect="off"
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        {...input}
      />
    </div>
  </div>
);

AuthField.propTypes = {
  input: PropTypes.object.isRequired,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default AuthField;
