import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavMenu from './NavMenu';
import Alert from './Alert';
import { dismissAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';

class HeaderContainer extends React.Component {
  static closeMenu() {
    document.querySelector('ul#side-nav-1').setAttribute('aria-hidden', 'true');
    document.querySelector('button#side-nav-1-button').setAttribute('aria-expanded', 'false');
  }
  constructor(props) {
    super(props);

    this.dismissAlert = this.dismissAlert.bind(this);
    this.logOutUser = this.logOutUser.bind(this);
  }
  dismissAlert(e) {
    e.preventDefault();
    this.props.dismissAlert();
  }
  logOutUser() {
    this.props.logOutUser();
  }
  render() {
    return (
      <header className="usa-header usa-header-basic">
        <div className="group">
          { this.props.alertType ?
            (<Alert
              dismiss={this.dismissAlert}
              header={this.props.alertHeader}
              message={this.props.alertMessage}
              type={this.props.alertType}
            />) : (null)
          }
          <NavMenu
            closeMenu={HeaderContainer.closeMenu}
            loggedIn={this.props.loggedIn}
            logOutUser={this.logOutUser}
            userEmail={this.props.email}
          />
        </div>
      </header>
    );
  }
}

HeaderContainer.propTypes = {
  alertHeader: PropTypes.string,
  alertMessage: PropTypes.string,
  alertType: PropTypes.string,
  dismissAlert: PropTypes.func.isRequired,
  email: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    alertHeader: state.app.get('alertHeader'),
    alertMessage: state.app.get('alertMessage'),
    alertType: state.app.get('alertType'),
    email: state.auth.get('email') ? state.auth.get('email') : '',
    loggedIn: !!state.auth.get('email'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ dismissAlert, logOutUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
