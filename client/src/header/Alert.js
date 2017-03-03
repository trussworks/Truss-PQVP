import React, { PropTypes } from 'react';
import onClickOutside from 'react-onclickoutside';

class Alert extends React.Component {
  handleClickOutside(e) {
    this.props.dismiss(e);
  }
  render() {
    const alertStyles = `usa-alert group margin--none ${this.props.type}`;

    return (
      <div className={alertStyles}>
        <div className="usa-alert-body group">
          <h3 className="usa-alert-heading">{this.props.header}</h3>
          <p className="usa-alert-text">{this.props.message}</p>
        </div>
        <a href="" onClick={this.props.dismiss}>
          <img
            alt="close"
            className="icon--dismiss"
            src="../dist/public/img/close.svg"
          />
        </a>
      </div>
    );
  }
}

Alert.propTypes = {
  dismiss: PropTypes.func.isRequired,
  header: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
};

export default onClickOutside(Alert);
