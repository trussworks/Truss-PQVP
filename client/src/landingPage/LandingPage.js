import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AuthContainer from '../auth/AuthContainer';

class LandingPage extends React.Component {
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.dispatch(push('/profile'));
    }
  }
  render() {
    return (
      <div className="container">
        <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
        <AuthContainer />
      </div>
    );
  }
}

LandingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: !!state.auth.get('user').email,
  };
}

export default connect(mapStateToProps)(LandingPage);
