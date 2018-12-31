import React, { Component } from 'react';

class PureCanvas extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        ref={node => node ? this.props.contextRef(node) : null }
      />);
  }
}

export default PureCanvas;