import React, { Component } from 'react';
import ConwayControls from './components/ConwayControls';
import GOL from './components/game-of-life';

class App extends Component {

  componentDidMount() {
    GOL.init();
  }

  render() {
    return (
      <div>
        <canvas id="canvas"></canvas>
        <ConwayControls/>
      </div>
    );
  }
}

export default App;