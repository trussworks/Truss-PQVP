import React from 'react';

export class Root extends React.Component {
  constructor(props) {
    super(props);
    const resp = fetch('/hello/there');
    resp.then(response => response.text()).then((text) => {
      console.log(text);
    });
  }

  render() {
    return (
      <div>
        <h1>my Root is on Fire!</h1>
      </div>
    );
  }
}

export default Root;
