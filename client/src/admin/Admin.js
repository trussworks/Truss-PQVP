import React from 'react';
import { layer, source, Map, View } from 'openlayers';
import ReactDom, { render } from 'react-dom';

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'https://igems.doi.gov/arcgis/rest/services/igems_haz/MapServer/10?f=pjson',
    };
  }
  render() {
    var layers = [
      new layer.Tile({
        source: new source.OSM()
      }),
      new layer.Tile({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new source.TileArcGISRest({
          url: this.state.url,
        })
      })
    ];

    var map = new Map({
      layers: layers,
      target: 'map',
      view: new View({
        center: [-10997148, 4569099],
        zoom: 4
      })
    });

    return (
      <div className="container">
        <h1>Admin</h1>
      </div>
    );
  }
}

export default Admin;
