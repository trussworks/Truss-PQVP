import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { authenticateUser, signUpUser } from './authActions';

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false,
    };

    this.submitLogin = this.submitLogin.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
    this.toggleAuthType = this.toggleAuthType.bind(this);
  }
  submitLogin(values) {
    this.props.authenticateUser(values.email, values.password);
  }
  submitSignUp(values) {
    this.props.signUpUser(values.email, values.password);
  }
  toggleAuthType(e) {
    e.preventDefault();
    this.setState({ isLoggingIn: !this.state.isLoggingIn });
  }
  render() {
    return (
      <div>
        {this.state.isLoggingIn ?
          (<LoginForm
            onSubmit={this.submitLogin}
            switchForm={this.toggleAuthType}
          />) :
          (<SignUpForm
            onSubmit={this.submitSignUp}
            switchForm={this.toggleAuthType}
          />)
        }
      </div>
    );
  }
}

AuthContainer.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  signUpUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ authenticateUser, signUpUser }, dispatch);
}

export default connect(null, mapDispatchToProps)(AuthContainer);
