import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileForm from './ProfileForm';
import AddressField from './AddressField';

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
  saveNewAddress(address) {
    console.log('ADD ADDRESS:');
    console.log(this.state);
    console.log(address); // I believe this is GeoJSON so probably what we want to store.
  }
  render() {
    return (
      <div className="container--content">
        <ProfileForm onSubmit={this.submitUpdate} />
        <ChangePasswordForm
          togglePasswordForm={this.togglePasswordForm}
          updatingPassword={this.state.updatingPassword}
        />
        <AddressField saveAddress={this.saveNewAddress} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(ProfileContainer);
