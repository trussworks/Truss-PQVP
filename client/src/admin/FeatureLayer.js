import React, { PropTypes } from 'react';
import 'leaflet';
import esri from 'esri-leaflet';

function onMapClick(e) {
  console.log('You clicked the map at ' + e.latlng);
}

class FeatureLayer extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    const myFeatures = new esri.FeatureLayer({ url: this.props.url });
    myFeatures.addTo(this.context.map);
    this.context.map.on('click', onMapClick);
  }

// Qs.
// * What happens if we don't hit the server?

  render() {
    return (<div />);
  }
}

FeatureLayer.contextTypes = {
  map: React.PropTypes.object,
};

FeatureLayer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default FeatureLayer;
