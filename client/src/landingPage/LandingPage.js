import React from 'react';
import SignUp from '../auth/SignUp';

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { remote: 'Have Not Talked To Server' };
    const resp = fetch('/hello/PQVP');
    resp.then(response => response.text()).then((text) => {
      this.setState({ remote: `Server says: ${text}` });
    });
  }

  render() {
    return (
      <div>
        <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
        <SignUp />
      </div>
    );
  }
}

export default LandingPage;
