import React, { PropTypes } from 'react';

const AddressView = ({ address, removeAddress }) => (
  <div className="container--address">
    <span>
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          removeAddress(address);
        }}
      >
        <img
          alt="Remove address"
          className="icon--remove"
          src="../dist/public/img/close.svg"
        />
      </a>
      {address.address}
    </span>
  </div>
);

AddressView.propTypes = {
  address: PropTypes.object.isRequired,
  removeAddress: PropTypes.func.isRequired,
};

export default AddressView;
