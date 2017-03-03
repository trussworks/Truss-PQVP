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
    this.updatePhone = this.updatePhone.bind(this);
  }
  componentWillMount() {
    if (this.props.accessToken) {
      this.props.getProfile(this.props.accessToken);
    }
  }
  submitUpdate(values) {
    // Probably because of passing in props to initialValue
    // But maybe because there is some wonky state sticking around
    // we are getting values from more than the form should be sending us
    // so we filter down to the three we care about.
    const newProfile = Object.assign({}, this.props.profile,
      { alertEmail: values.alertEmail,
        alertPhone: values.alertPhone,
        onlyEmergencies: values.onlyEmergencies });
    this.props.updateProfile(this.props.accessToken, newProfile);
  }
  togglePasswordForm(e) {
    e.preventDefault();
    this.setState({ updatingPassword: !this.state.updatingPassword });
  }
  togglePhoneForm() {
    this.setState({ updatingPhone: !this.state.updatingPhone });
  }
  updateAddressState(newState) {
    this.setState({ newAddressState: newState });
  }
  updatePhone(values) {
    const newProfile = Object.assign({}, this.props.profile, values);
    this.props.updateProfile(this.props.accessToken, newProfile);
    this.togglePhoneForm();
  }
  removeAddress(address) {
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
    this.togglePasswordForm();
  }
  isAlertable() {
    const profile = this.props.profile;
    return (profile.addresses && profile.addresses.length > 0
      && (profile.alertEmail || (profile.phone && profile.alertPhone)));
  }
  render() {
    return (
      <div className="container--content">
        <h1 className="text--center text__margin--70">User Profile</h1>
        <div className="container--blue">
          Please register below to receive notifications from the State of CA.
          If there are ever imminent emergencies near any of the addresses your provide, you will
          be sent an email and/or a text message notifying you as soon as possible. Furthermore,
          should you be affected by a disaster, you will be notified of relief efforts in the same
          way.
        </div>
        { !(this.props.profile && this.props.profile.addresses) ? (
          <div>loading profile...</div>
          ) : (
            <div>
              { this.isAlertable() ? (null) :
              <div className="container--red">
                Until you have filled out an address and have selected a notification type, you
                will not be able to receive any notifications.
              </div> }
              <UserInfo
                initialValues={this.props.profile}
                profile={this.props.profile}
                togglePasswordForm={this.togglePasswordForm}
                togglePhoneForm={this.togglePhoneForm}
                updatePassword={this.updatePassword}
                updatePhone={this.updatePhone}
                updatingPassword={this.state.updatingPassword}
                updatingPhone={this.state.updatingPhone}
                userEmail={this.props.email}
              />
              <AlertSettingsForm
                initialValues={this.props.profile}
                onSubmit={this.submitUpdate}
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
