import React, { PropTypes } from 'react';
import AddressField from './AddressField';

const Addresses = ({
  addresses,
  saveNewAddress,
  updateAddressState,
  addressFieldState,
  removeAddress,
 }) => (
   <div>
     <h3>Receive Alerts For Which Addresses?</h3>
     {addresses.map(address => (
       <div key={address.address}>
         <div>{address.address}</div>
         <button onClick={() => removeAddress(address)}>Remove Address</button>
       </div>
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
