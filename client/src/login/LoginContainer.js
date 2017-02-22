import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import { authenticateUser } from './loginActions';

function mapDispatchToProps(dispatch) {
  return ({
    onSubmit: (values) => {
      dispatch(authenticateUser(values.email, values.password));
    },
  });
}

function mapStateToProps() {
  return ({});
}

export const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default LoginContainer;
