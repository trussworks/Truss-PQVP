import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AdminHeader from './AdminHeader';
import EmergencyPicker from './EmergencyPicker';
import AlertForm from './AlertForm';
import { postAlert } from './adminActions';

const initialValues = { isEmergency: false };

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { feature: undefined };

    this.selectFeature = this.selectFeature.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectFeature(feature) {
    this.setState({ feature });
  }

  handleSubmit(values) {
    const alert = {
      geojson: this.state.feature,
      message: values.alertMessage,
      severity: values.isEmergency ? 'EMERGENCY' : 'NON_EMERGENCY',
    };

    this.props.postAlert(this.props.accessToken, alert);
  }

  render() {
    return (
      <div className="container--content">
        <AdminHeader />
        <EmergencyPicker selectFeature={this.selectFeature} selectedFeature={this.state.feature} />
        <AlertForm
          feature={this.state.feature}
          featurePicked={!!this.state.feature}
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
        />
      </div>
    );
  }
}

AdminPage.propTypes = {
  accessToken: PropTypes.string,
  postAlert: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    accessToken: state.auth.get('accessToken'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ postAlert }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
