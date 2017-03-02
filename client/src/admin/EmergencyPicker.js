import React, { PropTypes } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import FeatureLayer from './FeatureLayer';

const layers = [
  { name: 'Weather Warnings', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/12' },
  { name: 'Weather Watches', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/13' },
  { name: 'Weather Advisories', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/14' },
];

class EmergencyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 37.7,
      lng: -122.4,
      zoom: 8,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          { layers.map(layer => (
            <FeatureLayer
              key={layer.name}
              url={layer.url}
              selectFeature={this.props.selectFeature}
              selectedFeature={this.props.selectedFeature}
            />
          ))}
        </Map>
      </div>
    );
  }
}

EmergencyPicker.propTypes = {
  selectFeature: PropTypes.func.isRequired,
  selectedFeature: PropTypes.object,
};

export default EmergencyPicker;
