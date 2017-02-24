import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import FeatureLayer from './FeatureLayer';

class EmergencyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 37.7,
      lng: -122.4,
      zoom: 8,
      selectedFeature: undefined,
    };

    this.selectFeature = this.selectFeature.bind(this);
  }
  selectFeature(feature) {
    this.setState({ selectedFeature: feature });
  }
  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <h1>hello team</h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <FeatureLayer
            url="https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/14"
            selectFeature={this.selectFeature}
            selectedFeatureId={this.state.selectedFeature && this.state.selectedFeature.id}
          />
        </Map>
      </div>
    );
  }
}

export default EmergencyPicker;
