import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationsList from './NotificationsList';
import NotificationsMap from './NotificationsMap';
import { fetchHistory } from './adminActions';

class NotificationsPage extends React.Component {
  componentDidMount() {
    this.props.fetchHistory(this.props.authToken);
  }
  render() {
    return (
      <div className="container--content">
        <h1 className="text--center text__margin--70">Notifications</h1>
        <NotificationsMap />
        <NotificationsList history={this.props.history} />
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  authToken: PropTypes.string.isRequired,
  fetchHistory: PropTypes.func.isRequired,
  history: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    authToken: state.auth.get('accessToken'),
    history: state.admin.get('history'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchHistory }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage);
