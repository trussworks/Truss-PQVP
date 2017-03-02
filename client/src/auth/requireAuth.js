import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export default function requireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      /* Only need to check here if the page was visited directly */
      if (this.props.loggedIn !== true) {
        this.checkAndRedirect();
      }
    }
    shouldComponentUpdate(nextProps) {
      /*
      * Since this page is only accessed in logged in state we only need
      * to check again if their loggedIn status changes to false
      */
      return this.props.loggedIn === true && nextProps.loggedIn === false;
    }
    componentDidUpdate() {
      this.checkAndRedirect();
    }
    checkAndRedirect() {
      if (this.props.loggedIn) {
        console.log('logged in!');
      } else {
        this.props.dispatch(push('/'));
      }
    }
    render() {
      return (
        <div className="authenticated">
          <Component {...this.props} />
        </div>
      );
    }
  }

  AuthenticatedComponent.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  };

  function mapStateToProps(state) {
    return {
      loggedIn: !!state.auth.get('email'),
    };
  }

  return connect(mapStateToProps)(AuthenticatedComponent);
}
