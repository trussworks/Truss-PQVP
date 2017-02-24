import React, { PropTypes } from 'react';
import AutoComplete from 'react-autocomplete';
// import { reduxForm, Field } from 'redux-form';

const MAPZEN_API_KEY = 'mapzen-Xt7d1Sz';
const MAPZEN_AUTOCOMPLETE_URL = 'https://search.mapzen.com/v1/autocomplete';
const SF_LAT = '37.7';
const SF_LON = '-122.4';

const styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default',
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default',
  },

  menu: {
    border: 'solid 1px #ccc',
  },
};

function getURL(baseURL, getParams) {
  const query = Object.keys(getParams)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(getParams[k])}`)
  .join('&');

  return `${baseURL}?${query}`;
}

function suggestionsRequest(value) {
  const params = {
    api_key: MAPZEN_API_KEY,
    'focus.point.lat': SF_LAT,
    'focus.point.lon': SF_LON,
    text: value,
  };
  const reqURL = getURL(MAPZEN_AUTOCOMPLETE_URL, params);

  return fetch(reqURL).then(rsp => rsp.json());
}

class AddressField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      loading: false,
    };
  }

// TODO: rate limiting, making sure you only show suggestions monotonically increasingly.

  render() {
    return (
      <div>
        <label htmlFor="input-type-text">Address:</label>
        <AutoComplete
          value={this.state.value}
          items={this.state.suggestions}
          getItemValue={item => item.properties.label}
          onSelect={(value, item) => {
            this.setState({ value, suggestions: [item] }); // Probably unneccecary
            this.props.saveAddress(item);
          }}
          onChange={(event, value) => {
            this.setState({ value, loading: true });
            suggestionsRequest(value).then((result) => {
              this.setState({ suggestions: result.features });
            });
          }}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
            >{item.properties.label}</div>
          )}
        />
      </div>
    );
  }
}

AddressField.propTypes = {
  saveAddress: PropTypes.func.isRequired,
};

export default AddressField;
