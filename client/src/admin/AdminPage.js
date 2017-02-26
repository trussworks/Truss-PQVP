import React from 'react';
import EmergencyPicker from './EmergencyPicker';
import AlertForm from './AlertForm';

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
    console.log('Submitting Alert!');
    console.log(this.state.feature);
    console.log(values);
  }

  render() {
    return (
      <div className="container">
        <h1>Admin Page</h1>
        <EmergencyPicker selectFeature={this.selectFeature} selectedFeature={this.state.feature} />
        <AlertForm
          featurePicked={!!this.state.feature}
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
        />
      </div>
    );
  }
}

export default AdminPage;
