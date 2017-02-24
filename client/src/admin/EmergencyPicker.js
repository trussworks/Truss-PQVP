import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FeatureLayer from './FeatureLayer';

class EmergencyPicker extends React.Component {
  constructor(props) {
    super(props);
    console.log('construct Picker');
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
        <h1>hello team</h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <FeatureLayer url="https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/14" />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

export default EmergencyPicker;
