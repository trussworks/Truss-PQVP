import React, { PropTypes } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import FeatureLayer from './FeatureLayer';

class EmergencyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 38.581,
      lng: -121.494,
      zoom: 7,
      layers: {
        warnings: { label: 'Weather Warnings', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/12', visible: true },
        watches: { label: 'Weather Watches', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/13', visible: true },
        advisories: { label: 'Weather Advisories', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/14', visible: true },
        wildfires: { label: 'Wildfires', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/11', visible: true },
        hurricanes: { label: 'Hurricanes', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/9', visible: true },
        earthquakes: { label: 'Earthquakes', url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/4', visible: true },
        counties: { label: 'CA Counties', url: 'https://gis.water.ca.gov/arcgis/rest/services/Public/Boundaries_Map/MapServer/0', visible: false },
      },
    };

    this.changeLayerVisibility = this.changeLayerVisibility.bind(this);
  }
  changeLayerVisibility(event) {
    const newLayers = Object.assign({}, this.state.layers);
    newLayers[event.target.name].visible = !newLayers[event.target.name].visible;
    this.setState({ layers: newLayers });
  }
  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <h3>Select the region you wish to alert:</h3>
        <div className="map-box">
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
              key="tileLayer"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            { Object.keys(this.state.layers).map((name) => {
              const layer = this.state.layers[name];
              return (
                <FeatureLayer
                  key={name}
                  url={layer.url}
                  selectFeature={this.props.selectFeature}
                  selectedFeature={this.props.selectedFeature}
                  visible={layer.visible}
                />
              );
            })}
          </Map>
        </div>
        <div className="map-switches">
          { Object.keys(this.state.layers).map((name) => {
            const layer = this.state.layers[name];
            return (
              <div key={name}>
                <input
                  checked={layer.visible}
                  className="input__checkbox--layers"
                  name={name}
                  onChange={this.changeLayerVisibility}
                  type="checkbox"
                />
                <label htmlFor={name}>{layer.label}</label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

EmergencyPicker.propTypes = {
  selectFeature: PropTypes.func.isRequired,
  selectedFeature: PropTypes.object,
};

export default EmergencyPicker;
