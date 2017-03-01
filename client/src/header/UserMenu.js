import React, { PropTypes } from 'react';

const UserMenu = ({ loggedIn, logOutUser }) => (
  <div>
    <li>
      <a
        href="http://www.cio.ca.gov/"
        rel="noopener noreferrer"
        target="_blank"
      >
        CA Department of Technology
      </a>
    </li>
    <li>
      <a
        href="https://truss.works/"
        rel="noopener noreferrer"
        target="_blank"
      >
        About Truss
      </a>
    </li>
    { loggedIn ?
      (<div>
        <li><a href="" onClick={logOutUser}>Log out</a></li>
      </div>) : (null)
    }
  </div>
);

UserMenu.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logOutUser: PropTypes.func.isRequired,
};

export default UserMenu;
