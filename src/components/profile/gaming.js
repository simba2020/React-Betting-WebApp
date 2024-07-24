import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Env from 'utils/Env';

class Gaming extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <iframe
        src={Env.URL + '#gaming'}
        width="100%"
        style={{ minHeight: '99%', border: 'none' }}
        title="gaming"
      ></iframe>
    );
  }
}

export default withRouter(Gaming);
