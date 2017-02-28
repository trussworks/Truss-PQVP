import React, { PropTypes } from 'react';

const Alert = ({ dismiss, header, message, type }) => {
  const alertStyles = `usa-alert group margin--none ${type}`;

  return (
    <div className={alertStyles}>
      <div className="usa-alert-body group">
        <h3 className="usa-alert-heading">{header}</h3>
        <p className="usa-alert-text">{message}</p>
      </div>
      <a href="" onClick={dismiss}>
        <img
          alt="close"
          className="icon--dismiss"
          src="../dist/public/img/close.svg"
        />
      </a>
    </div>
  );
};

Alert.propTypes = {
  dismiss: PropTypes.func.isRequired,
  header: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Alert;
