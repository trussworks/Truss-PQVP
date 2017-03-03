import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationsList from './NotificationsList';
import NotificationsMap from './NotificationsMap';
import { fetchHistory } from './adminActions';

class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAll: true,
      filteredAlerts: [],
    };

    this.toggleAlertFilter = this.toggleAlertFilter.bind(this);
  }
  componentDidMount() {
    this.props.fetchHistory(this.props.authToken);
  }
  componentDidUpdate(nextProps) {
    if (this.props.history.length === 0 && nextProps.history.length > 0) {
      this.setState({ filteredAlerts: nextProps.history });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ filteredAlerts: nextProps.history });
  }
  toggleAlertFilter() {
    this.setState({ displayAll: !this.state.displayAll }, () => {
      if (this.state.displayAll) {
        this.setState({ filteredAlerts: this.props.history });
      } else {
        const filtered = this.props.history.filter(alert => this.props.userEmail === alert.sender);
        this.setState({ filteredAlerts: filtered });
      }
    });
  }
  render() {
    return (
      <div className="container--content">
        <h1 className="text--center text__margin--70">Alert Monitoring</h1>
        <NotificationsMap history={this.state.filteredAlerts} />
        <NotificationsList
          displayAll={this.state.displayAll}
          history={this.state.filteredAlerts}
          toggleAlertFilter={this.toggleAlertFilter}
        />
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  authToken: PropTypes.string.isRequired,
  fetchHistory: PropTypes.func.isRequired,
  history: PropTypes.array,
  userEmail: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    authToken: state.auth.get('accessToken'),
    history: state.admin.get('history'),
    userEmail: state.auth.get('email'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchHistory }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage);
