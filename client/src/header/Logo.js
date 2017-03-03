import React from 'react';
import { Link } from 'react-router';

const Logo = () => (
  <div className="usa-navbar container--logo">
    <button className="usa-menu-btn">Menu</button>
    <div className="usa-logo container--logo-image" id="logo">
      <img className="logo--ca usa-media_block-img" src="/dist/public/img/logo-CAState.png" alt="State of California Seal" />
      <div className="container--logo-text">
        <em className="usa-logo-text">
          <Link to="/" title="Home" aria-label="Home">Emergency <br />Alert App</Link>
        </em>
      </div>
    </div>
  </div>
);

export default Logo;
