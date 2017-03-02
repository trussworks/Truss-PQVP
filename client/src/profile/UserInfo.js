import React, { PropTypes } from 'react';
import PasswordForm from './PasswordForm';
import PhoneForm from './PhoneForm';

const UserInfo = ({
  profile,
  togglePasswordForm,
  togglePhoneForm,
  updatePassword,
  updatePhone,
  updatingPassword,
  updatingPhone,
  userEmail,
}) => (
  <div className="container--left">
    <legend><h3>Account Details</h3></legend>
    <table className="table--no-border">
      <tbody>
        <tr>
          <td className="cell--left"><strong>Email:</strong></td>
          <td>{userEmail}</td>
        </tr>
        <tr>
          <td className="cell--left"><strong>Password:</strong></td>
          <td>
            ********<br />
            <a href="" onClick={togglePasswordForm}>Change password</a>
            {updatingPassword ?
              (<PasswordForm
                userEmail={userEmail}
                togglePasswordForm={togglePasswordForm}
                updatingPassword={updatingPassword}
                onSubmit={updatePassword}
              />) : (null)
            }
          </td>
        </tr>
        <tr>
          <td className="cell--left"><strong>Phone:</strong></td>
          <td>
            { profile.phone ? profile.phone : 'N/A' }<br />
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                togglePhoneForm();
              }}
            >
              Update phone number
            </a>
            {updatingPhone ?
              (<PhoneForm
                profile={profile}
                onSubmit={updatePhone}
                initialValues={profile}
              />) : (null)
            }
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

UserInfo.propTypes = {
  profile: PropTypes.object,
  togglePasswordForm: PropTypes.func.isRequired,
  togglePhoneForm: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  updatePhone: PropTypes.func.isRequired,
  updatingPassword: PropTypes.bool.isRequired,
  updatingPhone: PropTypes.bool.isRequired,
  userEmail: PropTypes.string,
};

export default UserInfo;
