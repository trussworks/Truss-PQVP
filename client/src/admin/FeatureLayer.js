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

  componentDidMount() {
    this.state.esriLayer.addTo(this.context.map);
    this.state.esriLayer.bindPopup((evt) => {
      this.props.selectFeature(evt.feature);
      return L.Util.template('<p>{event}<br>{id}</p>', evt.feature.properties);
    });
    this.state.esriLayer.setStyle(UNSELECTED_STYLE);
  }

// Qs.
// * What happens if we don't hit the server? How do we error?

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
