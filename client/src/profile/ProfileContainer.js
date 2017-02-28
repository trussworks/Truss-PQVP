import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import UserForm from './UserForm';
import ProfileForm from './ProfileForm';
import AddressField from './AddressField';
import { getProfile, updateProfile } from './profileActions';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatingPassword: false,
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
    this.togglePasswordForm = this.togglePasswordForm.bind(this);
  }
  componentWillMount() {
    console.log('fetching profile');
    this.props.dispatch(getProfile());
  }
  submitUpdate(values) {
    console.log('updating Profile');
    console.log(this.props);
    console.log(values);
    const newProfile = {};
    Object.assign(newProfile, this.props.profile, values);
    console.log(newProfile);
    this.props.dispatch(updateProfile(newProfile));
  }
  togglePasswordForm(e) {
    e.preventDefault();
    this.setState({ updatingPassword: !this.state.updatingPassword });
  }
  saveNewAddress(address) {
    console.log('ADD ADDRESS:');
    console.log(this.state);
    console.log(address); // I believe this is GeoJSON so probably what we want to store.
    const newProfile = this.props.profile.copy();
    newProfile.addresses.append(address);
    this.props.dispatch(updateProfile(newProfile));
  }
  render() {
    return (
      <div className="container--content">
        <UserForm
          user={this.props.user}
          togglePasswordForm={this.togglePasswordForm}
          updatingPassword={this.state.updatingPassword}
        />
        { !this.props.profile ? (
          <div>loading profile...</div>
          ) : (
            <div>
              <ProfileForm
                profile={this.props.profile}
                onSubmit={this.submitUpdate}
                initialValues={this.props.profile}
              />
              { this.props.profile.addresses.map(address => (
                <div key={address.properties.name}>
                  <div>Address:</div>
                  <div>{address.properties.name}</div>
                  <button>removeme</button>
                </div>
              ))}
              <AddressField saveAddress={this.saveNewAddress} />
            </div>
          )}
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  profile: PropTypes.object,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    profile: state.profile.get('profile'),
    user: state.auth.get('user'),
  };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({}, dispatch);
// }

export default connect(mapStateToProps)(ProfileContainer);
