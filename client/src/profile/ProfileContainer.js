import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileForm from './ProfileForm';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatingPassword: false,
    };

    this.submitUpdate = this.submitUpdate.bind(this);
    this.togglePasswordForm = this.togglePasswordForm.bind(this);
  }
  submitUpdate(values) {
    console.log(this.props);
    console.log(values);
  }
  togglePasswordForm(e) {
    e.preventDefault();
    this.setState({ updatingPassword: !this.state.updatingPassword });
  }
  render() {
    return (
      <div className="container">
        <ProfileForm onSubmit={this.submitUpdate} />
        <ChangePasswordForm
          togglePasswordForm={this.togglePasswordForm}
          updatingPassword={this.state.updatingPassword}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(ProfileContainer);
