import React, { PropTypes } from 'react';
import { Map, TileLayer, GeoJSON, Popup } from 'react-leaflet';

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
          { this.props.history.map(alert => (
            <GeoJSON
              key={alert.message} // jank. we need to have an ID.
              data={alert.geojson}
              color="blue"
            >
              <Popup>
                <span>{alert.message} sent by: {alert.sender}</span>
              </Popup>
            </GeoJSON>
          ))}
        </Map>
      </div>
    );
  }
}

NotificationsMap.propTypes = {
  history: PropTypes.array.isRequired,
};

export default NotificationsMap;
