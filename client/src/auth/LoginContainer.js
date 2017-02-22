import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginForm from './LoginForm';
import { authenticateUser } from './authActions';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.submitLogin = this.submitLogin.bind(this);
  }
  submitLogin(values) {
    this.props.authenticateUser(values.email, values.password);
  }
  render() {
    return (
      <LoginForm onSubmit={this.submitLogin} />
    );
  }
}

LoginContainer.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ authenticateUser }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginContainer);
