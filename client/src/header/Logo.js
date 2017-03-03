import React from 'react';

const Logo = () => (
  <div className="usa-navbar container--logo">
    <button className="usa-menu-btn">Menu</button>
    <div className="usa-logo container--logo-image" id="logo">
      <img className="logo--ca usa-media_block-img" src="/dist/public/img/logo-CAState.png" alt="State of California Seal" />
      <div className="container--logo-text">
        <em className="usa-logo-text">
          <a href="" title="Home" aria-label="Home">Emergency <br />Alert App</a>
        </em>
      </div>
    </div>
  </div>
);

export default Logo;
