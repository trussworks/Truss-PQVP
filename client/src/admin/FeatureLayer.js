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
    if (this.props.visible) {
      this.context.map.addLayer(this.state.esriLayer);
    }
    this.state.esriLayer.bindPopup((fLayer) => {
      const feature = fLayer.toGeoJSON();
      this.props.selectFeature(feature);
      let template;
      if (feature.properties.event) {
        template = L.Util.template('<p>{event}</p>', feature.properties);
      } else if (feature.properties.NAME_PCASE) {
        template = L.Util.template('<p>{NAME_PCASE} County</p>', feature.properties);
      }
      return template;
    });
    this.state.esriLayer.setStyle(UNSELECTED_STYLE);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        this.context.map.addLayer(this.state.esriLayer);
      } else {
        this.context.map.removeLayer(this.state.esriLayer);
      }
    }
  }

  render() {
    this.state.esriLayer.eachFeature((wrapper) => {
      const feature = wrapper.feature;
      let thisStyle = UNSELECTED_STYLE;
      if (this.props.selectedFeature) {
        const selectedFeature = this.props.selectedFeature;
        if (selectedFeature.properties.link === feature.properties.link
          && selectedFeature.id === feature.id) {
          thisStyle = SELECTED_STYLE;
        }
      }
      this.state.esriLayer.setFeatureStyle(feature.id, thisStyle);
    });

    return (<div />);
  }
}

FeatureLayer.contextTypes = {
  map: React.PropTypes.object,
};

FeatureLayer.propTypes = {
  url: PropTypes.string.isRequired,
  selectFeature: PropTypes.func.isRequired,
  selectedFeature: PropTypes.object,
  visible: PropTypes.bool.isRequired,
};

export default FeatureLayer;
