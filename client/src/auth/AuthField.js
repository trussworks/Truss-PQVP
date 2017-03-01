import React, { PropTypes } from 'react';
import classnames from 'classnames';

export const AuthField = ({ input, placeholder, meta, type }) => {
  const errorClass = classnames({
    'usa-input-error': meta.touched && meta.error,
  });

  const successClass = classnames({
    'usa-input-success': meta.touched && !meta.error,
  });

  const labelId = `input--label--${input.name}`;
  const errorId = `input--error--${input.name}`;

  return (
    <div>
      <div className={errorClass}>
        <label htmlFor={input.name} id={labelId} >{placeholder}</label>
        { meta.touched && meta.error ?
          (<span
            className="usa-input-error-message"
            id={errorId}
            role="alert"
          >{meta.error}</span>)
          : (null)
        }
        <input
          aria-describedby={errorId}
          aria-labelledby={labelId}
          autoCapitalize="off"
          autoCorrect="off"
          className={successClass}
          id={input.name}
          name={input.name}
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
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default AuthField;
