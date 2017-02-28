import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavMenu from './NavMenu';
import Alert from './Alert';
import { dismissAlert } from '../app/appActions';
import { logOutUser } from '../auth/authActions';

class HeaderContainer extends React.Component {
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
          <div className="container--content">
            { this.props.alertType ?
              (<Alert
                dismiss={this.dismissAlert}
                header={this.props.alertHeader}
                message={this.props.alertMessage}
                type={this.props.alertType}
              />) : (null)
            }
            <NavMenu
              loggedIn={this.props.loggedIn}
              logOutUser={this.logOutUser}
              userEmail={this.props.email}
            />
          </div>
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
    email: state.auth.get('user').email ? state.auth.get('user').email.email : '',
    loggedIn: !!state.auth.get('user').email,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ dismissAlert, logOutUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
