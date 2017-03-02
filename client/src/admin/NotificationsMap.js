import React from 'react';
import { Map, TileLayer } from 'react-leaflet';

class NotificationsMap extends React.Component {
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
      <div className="container--half">
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            key="tileLayer"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}

export default NotificationsMap;
