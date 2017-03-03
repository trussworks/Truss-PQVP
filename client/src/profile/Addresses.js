import React, { PropTypes } from 'react';
import AddressField from './AddressField';
import AddressView from './AddressView';

const Addresses = ({
  addresses,
  saveNewAddress,
  updateAddressState,
  addressFieldState,
  removeAddress,
}) => (
  <div className="container--bottom">
    <h3>Your Addresses</h3>
    {addresses.map(address => (
      <AddressView
        address={address}
        key={address.address}
        removeAddress={removeAddress}
      />
    ))}
    <AddressField
      saveAddress={saveNewAddress}
      updateAddressState={updateAddressState}
      fieldState={addressFieldState}
    />
  </div>
);

Addresses.propTypes = {
  addresses: PropTypes.array.isRequired,
  saveNewAddress: PropTypes.func.isRequired,
  updateAddressState: PropTypes.func.isRequired,
  removeAddress: PropTypes.func.isRequired,
  addressFieldState: PropTypes.string.isRequired,
};

export default Addresses;
