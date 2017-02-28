import React, { PropTypes } from 'react';
import classnames from 'classnames';

export const AuthField = ({ input, placeholder, meta, name, type }) => {
  const errorClass = classnames({
    'usa-input-error': meta.touched && meta.error,
  });

  const successClass = classnames({
    'usa-input-success': meta.touched && !meta.error,
  });

  return (
    <div>
      <div className={errorClass}>
        <label htmlFor={name}>{placeholder}</label>
        { meta.touched && meta.error ?
          (<span
            className="usa-input-error-message"
            id="input-error-message"
            role="alert"
          >{meta.error}</span>)
          : (null)
        }
        <input
          autoCapitalize="off"
          autoCorrect="off"
          className={successClass}
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          {...input}
        />
      </div>
    </div>
  );
};

AuthField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default AuthField;
