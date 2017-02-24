import React, { PropTypes } from 'react';
import 'leaflet';
import esri from 'esri-leaflet';

function onMapClick(e) {
  console.log(`You clicked the map at ${e.latlng}`);
}

const UNSELECTED_STYLE = {
  color: 'blue',
  weight: 1,
};

const SELECTED_STYLE = {
  color: 'red',
  weight: 2,
};

class FeatureLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { esriLayer: undefined };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onFeatureLoad = this.onFeatureLoad.bind(this);
  }

  componentWillMount() {
    const myFeatures = new esri.FeatureLayer({ url: this.props.url });
    this.setState({ esriLayer: myFeatures });
  }

  componentDidMount() {
    this.state.esriLayer.addTo(this.context.map);
    this.state.esriLayer.on('load', this.onFeatureLoad);
    this.state.esriLayer.bindPopup((evt) => {
      console.log('popping up on ');
      console.log(evt.feature);
      this.props.selectFeature(evt.feature);
      return L.Util.template('<p>{event}<br>{id}</p>', evt.feature.properties);
    });
    this.state.esriLayer.setStyle(UNSELECTED_STYLE);

    this.context.map.on('click', onMapClick);
  }

  onFeatureLoad(something) {
    console.log('loaded');
    console.log(something);

    this.state.esriLayer.eachFeature((feature) => {
      console.log(feature);
    });
  }

// Qs.
// * What happens if we don't hit the server?

  render() {
    console.log('rendering!');
    this.state.esriLayer.eachFeature((wrapper) => {
      const feature = wrapper.feature;
      console.log(feature);
      console.log(feature.id);
      this.state.esriLayer.setFeatureStyle(feature.id, UNSELECTED_STYLE);
    });

    if (this.props.selectedFeatureId) {
      console.log('we in bidniess');
      this.state.esriLayer.setFeatureStyle(this.props.selectedFeatureId, SELECTED_STYLE);
    }
    return (<div />);
  }
}

FeatureLayer.contextTypes = {
  map: React.PropTypes.object,
};

FeatureLayer.propTypes = {
  url: PropTypes.string.isRequired,
  selectFeature: PropTypes.func.isRequired,
  selectedFeatureId: PropTypes.number,
};

export default FeatureLayer;
