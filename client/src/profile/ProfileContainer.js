import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserInfo from './UserInfo';
import AlertSettingsForm from './AlertSettingsForm';
import Addresses from './Addresses';
import { getProfile, updateProfile } from './profileActions';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatingPassword: false,
      updatingPhone: false,
      newAddressState: '',
    };

    this.submitUpdate = this.submitUpdate.bind(this);
    this.togglePasswordForm = this.togglePasswordForm.bind(this);
    this.togglePhoneForm = this.togglePhoneForm.bind(this);
    this.saveNewAddress = this.saveNewAddress.bind(this);
    this.updateAddressState = this.updateAddressState.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  componentWillMount() {
    this.props.getProfile(this.props.accessToken);
  }
  submitUpdate(values) {
    console.log(values);
    const newProfile = Object.assign({}, this.props.profile, values);
    this.props.updateProfile(this.props.accessToken, newProfile);
  }
  togglePasswordForm(e) {
    e.preventDefault();
    this.setState({ updatingPassword: !this.state.updatingPassword });
  }
  togglePhoneForm(e) {
    e.preventDefault();
    this.setState({ updatingPhone: !this.state.updatingPhone });
  }
  updateAddressState(newState) {
    this.setState({ newAddressState: newState });
  }
  removeAddress(address) {
    console.log(address);
    const newProfile = Object.assign({}, this.props.profile);
    const loc = newProfile.addresses.indexOf(address);
    if (loc === -1) {
      console.error('Attempting to remove an address that is not in the list');
      return;
    }
    newProfile.addresses.splice(loc, 1);
    this.props.updateProfile(this.props.accessToken, newProfile);
  }
  saveNewAddress(address) {
    const newAddress = {
      address: address.properties.label,
      latitude: address.geometry.coordinates[1],
      longitude: address.geometry.coordinates[0],
    };
    const newProfile = Object.assign({}, this.props.profile);
    newProfile.addresses.push(newAddress);
    this.props.updateProfile(this.props.accessToken, newProfile);
    this.setState({ newAddressState: '' });
  }
  updatePassword() {
    console.log(this);
  }
  render() {
    return (
      <div className="container--content">
        <h1 className="text--center text__margin--20">User Profile</h1>
        { !(this.props.profile && this.props.profile.addresses) ? (
          <div>loading profile...</div>
          ) : (
            <div>
              <UserInfo
                initialValues={this.props.profile}
                submitUpdate={this.submitUpdate}
                profile={this.props.profile}
                togglePasswordForm={this.togglePasswordForm}
                togglePhoneForm={this.togglePhoneForm}
                updatePassword={this.updatePassword}
                updatingPassword={this.state.updatingPassword}
                updatingPhone={this.state.updatingPhone}
                userEmail={this.props.email}
              />
              <AlertSettingsForm
                handleSubmit={this.submitUpdate}
              />
              <Addresses
                addresses={this.props.profile.addresses}
                saveNewAddress={this.saveNewAddress}
                updateAddressState={this.updateAddressState}
                addressFieldState={this.state.newAddressState}
                removeAddress={this.removeAddress}
              />
            </div>
          )}
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  accessToken: PropTypes.string,
  email: PropTypes.string,
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object,
  updateProfile: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    accessToken: state.auth.get('accessToken'),
    email: state.auth.get('email'),
    profile: state.profile.get('profile'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getProfile, updateProfile }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
