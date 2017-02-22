import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

class LoginFormUnwrapped extends Component {
  constructor(props) {
    super(props);
    console.log('hi');
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component="input" type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Field name="password" component="input" type="password" />
        </div>
        <button type="submit" disabled={this.props.submitting}>Sign In</button>
      </form>
    );
  }
}

LoginFormUnwrapped.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

// Decorate the form component
export const LoginForm = reduxForm({
  form: 'login', // a unique name for this form
})(LoginFormUnwrapped);

export default LoginForm;
