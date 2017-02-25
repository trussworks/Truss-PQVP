import React, { PropTypes } from 'react';
import AutoComplete from 'react-autocomplete';

const MAPZEN_API_KEY = 'mapzen-Xt7d1Sz';
const MAPZEN_AUTOCOMPLETE_URL = 'https://search.mapzen.com/v1/autocomplete';
const SF_LAT = '37.7';
const SF_LON = '-122.4';

class AddressField extends React.Component {
  static getURL(baseURL, getParams) {
    const query = Object.keys(getParams)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(getParams[k])}`)
    .join('&');

    return `${baseURL}?${query}`;
  }

  static suggestionsRequest(value) {
    const params = {
      api_key: MAPZEN_API_KEY,
      'focus.point.lat': SF_LAT,
      'focus.point.lon': SF_LON,
      text: value,
    };
    const reqURL = AddressField.getURL(MAPZEN_AUTOCOMPLETE_URL, params);

    return fetch(reqURL).then(rsp => rsp.json());
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      loading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onChange(event, value) {
    this.setState({ value, loading: true });
    AddressField.suggestionsRequest(value).then((result) => {
      this.setState({ suggestions: result.features });
    });
  }
  onSelect(value, item) {
    this.setState({ value });
    this.props.saveAddress(item);
  }

// TODO: rate limiting, making sure you only show suggestions monotonically increasingly.
  render() {
    return (
      <div>
        <label htmlFor="input-type-text">Add Address:</label>
        <AutoComplete
          value={this.state.value}
          items={this.state.suggestions}
          getItemValue={item => item.properties.label}
          onSelect={this.onSelect}
          onChange={this.onChange}
          renderItem={(item, isHighlighted) => (
            <div
              className={isHighlighted ? 'autocomplete__item--highlighted' : 'autocomplete__item'}
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
