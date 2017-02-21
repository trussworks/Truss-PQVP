import React from 'react';

export class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = { remote: 'Have Not Talked To Server' };
    const resp = fetch('/hello/PQDP');
    resp.then(response => response.text()).then((text) => {
      this.setState({ remote: `Server says: ${text}` });
    });
  }

  render() {
    return (
      <div>
        <h1>my Root is on Fire!</h1>
        <p>{ this.state.remote }</p>
      </div>
    );
  }
}

export default Root;
