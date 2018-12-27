import React, { Component } from 'react';
import ConwayAnimate from './ConwayAnimate';
import { conwayConfig } from './config';
import { listLife } from './listLife';
// import GOL from './game-of-life';

const midX = window.innerWidth / 2;
const midY = window.innerHeight / 2;

let GOL = {

  columns: 0,
  rows: 0,

  waitTime: 0,
  generation: 0,

  running: false,
  autoplay: false,


  // Clear state
  clear: {
    schedule: false
  },


  // Average execution times
  times: {
    algorithm: 0,
    gui: 0
  },

  // Initial state
  initialState: `[{"${(midY / 5)}":[${(midX / 5) + 1}]},{"${(midY / 5) + 1}":[${(midX / 5) + 3}]},{"${(midY / 5) + 2}":[${(midX / 5)},${(midX / 5) + 1},${(midX / 5) + 4},${(midX / 5) + 5},${(midX / 5) + 6}]}]`,
}

class ConwayApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GOL,
      conwayConfig,
      listLife,
      urlParameters: null,
      loading: true
    }
  }

  //
  // ─── INIT FUNCTIONS ─────────────────────────────────────────────────────────────
  //


  runInit = () => {
    try {
      listLife.init();   // Reset/init algorithm
      this.loadConfig();      // Load config from URL (autoplay, colors, zoom, ...)
      this.loadState();       // Load state from URL
      // this.keepDOMElements(); // Keep DOM References (getElementsById)
      this.setState({loading: false})
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  /**
   * Load config from URL
   */
  loadConfig() {
    let { GOL, conwayConfig } = this.state;
    let { colors, grid, zoom, trail } = conwayConfig;

    GOL.autoplay = this.getUrlParameter('autoplay') === '1' ? true : GOL.autoplay;
    if (this.getUrlParameter('trail') === '1') {
      trail.current = true;
      conwayConfig.trail = trail;
    }
    
    // // Initial color config
    // colors = parseInt(this.getUrlParameter('colors'), 10);
    // if (isNaN(colors) || colors < 1 || colors > GOL.colors.schemes.length) {
    //     colors = 1;
    //   }
      
    //   // Initial grid config
    //   grid = parseInt(this.getUrlParameter('grid'), 10);
    //   if (isNaN(grid) || grid < 1 || grid > GOL.grid.schemes.length) {
    //       grid = 1;
    //     }
        
    //     // Initial zoom config
    //     zoom = parseInt(this.getUrlParameter('zoom'), 10);
    //     if (isNaN(zoom) || zoom < 1 || zoom > GOL.zoom.schemes.length) {
    //         zoom = 1;
    //       }
      
    colors.current = 3;
    grid.current = 3;
    zoom.current = 0;

    conwayConfig.colors = colors;
    conwayConfig.grid = grid;
    conwayConfig.zoom = zoom;
      
    this.setState({ conwayConfig });

    GOL.rows = conwayConfig.zoom.schemes[conwayConfig.zoom.current].rows;
    GOL.columns = conwayConfig.zoom.schemes[conwayConfig.zoom.current].columns;
  }

  /**
         * Load world state from URL parameter
         */
  loadState() {
    let { GOL } = this.state;
    var state, i, j, y, s = this.getUrlParameter('s');

    if (s === 'random') {
      GOL.randomState();
    } else {
      if (s == undefined) {
        s = GOL.initialState;
      }

      state = JSON.parse(decodeURI(s));

      for (i = 0; i < state.length; i++) {
        for (y in state[i]) {
          for (j = 0; j < state[i][y].length; j++) {
            listLife.addCell(state[i][y][j], parseInt(y, 10), listLife.actualState);
          }
        }
      }
    }
  }

  /**
     * Create a random pattern
     */
  randomState() {
    let { GOL } = this.state;
    var i, liveCells = (GOL.rows * GOL.columns) * 0.12;

    for (i = 0; i < liveCells; i++) {
      listLife.addCell(this.random(0, GOL.columns - 1), this.random(0, GOL.rows - 1), listLife.actualState);
    }

    this.listLife.nextGeneration();
  }

  /**
   * keepDOMElements
   * Save DOM references for this session (one time execution)
   */
  // keepDOMElements() {
  //   let { GOL } = this.state;
  //   GOL.element.generation = document.getElementById('generation');
  //   GOL.element.steptime = document.getElementById('steptime');
  //   GOL.element.livecells = document.getElementById('livecells');
  //   GOL.element.messages.layout = document.getElementById('layoutMessages');
  //   this.setState({GOL, loading: false})
  // }

  /**
   * Return a random integer from [min, max]
   */
  random(min, max) {
    return min <= max ? min + Math.round(Math.random() * (max - min)) : null;
  }

  /**
   * Get URL Parameters
   */
  getUrlParameter(name) {
    if (this.state.urlParameters === null) { // Cache miss
      var hash, hashes, i;
      let newParams = [];
      
      hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

      for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        newParams.push(hash[0]);
        newParams[hash[0]] = hash[1];
      }
      this.setState({urlParameters: newParams});
      return newParams[name];
    } else {
      return this.state.urlParameters[name];
    }
  }

  updateConfig = (newConfig) => {
    this.setState({conwayConfig: newConfig});
  }

  componentDidMount() {
    this.runInit();
  }

  render() {
    return (
     <React.Fragment>
       {!this.state.loading ? 
         <ConwayAnimate 
           GOL={this.state.GOL}
           listLife={this.state.listLife}
           conwayConfig={this.state.conwayConfig}
           updateConfig={this.updateConfig}
           runInit={this.runInit}
         />
         : <div>Loading...</div>
       }
     </React.Fragment>
    );
  }
}

export default ConwayApp;