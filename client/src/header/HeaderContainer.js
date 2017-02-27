import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NavMenu from './NavMenu';
import { logOutUser } from '../auth/authActions';

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.logOutUser = this.logOutUser.bind(this);
  }
  logOutUser() {
    this.props.dispatch(logOutUser);
  }
  render() {
    return (
      <header className="usa-header usa-header-basic">
        <div className="group">
          <div className="container">
            <NavMenu
              loggedIn={this.props.loggedIn}
              logOutUser={this.logOutUser}
              userEmail={this.props.email}
            />
          </div>
        </div>
      </header>
    );
  }
}

HeaderContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    email: state.auth.get('user').email ? state.auth.get('user').email.email : '',
    loggedIn: !!state.auth.get('user').email,
  };
}

export default connect(mapStateToProps)(HeaderContainer);
