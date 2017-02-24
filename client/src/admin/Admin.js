import React from 'react';
import { layer, source, Map, View } from 'openlayers';

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' +
          'Specialty/ESRI_StateCityHighway_USA/MapServer',
    };
  }
  componentDidMount() {
    const layers = [
      new layer.Tile({
        source: new source.OSM(),
      }),
      new layer.Tile({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new source.TileArcGISRest({
          url: this.state.url,
        }),
      }),
    ];

    const map = new Map({
      layers,
      target: 'map',
      view: new View({
        center: [-10997148, 4569099],
        zoom: 4,
      }),
    });

    map.setTarget(this.mapView);
  }
  render() {
    return (
      <div className="container">
        <h1>Admin</h1>
        <div ref={(input) => { this.mapView = input; }} />
      </div>
    );
  }
}

export default Admin;
