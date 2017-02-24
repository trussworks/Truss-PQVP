import React, { PropTypes } from 'react';
import 'leaflet';
import esri from 'esri-leaflet';

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
  }

  componentWillMount() {
    const myFeatures = new esri.FeatureLayer({ url: this.props.url });
    this.setState({ esriLayer: myFeatures });
  }
  // Qs.
  // * What happens if we don't hit the server? How do we error?
  componentDidMount() {
    this.state.esriLayer.addTo(this.context.map);
    this.state.esriLayer.bindPopup((fLayer) => {
      const feature = fLayer.toGeoJSON();
      this.props.selectFeature(feature);
      return L.Util.template('<p>{event}<br>{id}</p>', feature.properties);
    });
    this.state.esriLayer.setStyle(UNSELECTED_STYLE);
  }

  render() {
    this.state.esriLayer.eachFeature((wrapper) => {
      const feature = wrapper.feature;
      this.state.esriLayer.setFeatureStyle(feature.id, UNSELECTED_STYLE);
    });
    if (this.props.selectedFeatureId) {
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
