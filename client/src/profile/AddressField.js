import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';

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
      suggestions: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.updateSuggestions = this.updateSuggestions.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }
  onChange(event, value) {
    this.props.updateAddressState(value.newValue);
  }
  onSelect(event, { suggestion, suggestionValue }) {
    this.setState({ suggestions: [] });
    this.props.updateAddressState(suggestionValue);
    this.props.saveAddress(suggestion);
  }
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }
  updateSuggestions({ value }) {
    AddressField.suggestionsRequest(value).then((result) => {
      this.setState({ suggestions: result.features });
    });
  }

// TODO: rate limiting, making sure you only show suggestions monotonically increasingly.
  render() {
    const inputProps = {
      placeholder: 'Type an address',
      value: this.props.fieldState,
      onChange: this.onChange,
    };
    return (
      <div>
        <label htmlFor="input-type-text">Add Address:</label>
        <Autosuggest
          onSuggestionsFetchRequested={this.updateSuggestions}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          suggestions={this.state.suggestions}
          getSuggestionValue={item => item.properties.label}
          onSuggestionSelected={this.onSelect}
          highlightFirstSuggestion
          inputProps={inputProps}
          renderSuggestion={item => (
            <div>{item.properties.label}</div>
          )}
        />
      </div>
    );
  }
}

AddressField.propTypes = {
  saveAddress: PropTypes.func.isRequired,
  fieldState: PropTypes.string.isRequired,
  updateAddressState: PropTypes.func.isRequired,
};

export default AddressField;
