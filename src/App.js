import React, { Component } from 'react';
import ConwayAnimate from './components/ConwayAnimate';
import GOL from './components/game-of-life';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GOL,
      urlParameters: null,
    }
  }

  //
  // ─── INIT FUNCTIONS ─────────────────────────────────────────────────────────────
  //


  runInit = () => {
    let { GOL } = this.state;
    try {
      GOL.listLife.init();   // Reset/init algorithm
      this.loadConfig();      // Load config from URL (autoplay, colors, zoom, ...)
      this.loadState();       // Load state from URL
      this.keepDOMElements(); // Keep DOM References (getElementsById)
      GOL.canvas.init();     // Init canvas GUI
      // this.registerEvents();  // Register event handlers

      this.prepare();
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  /**
   * Load config from URL
   */
  loadConfig() {
    let { GOL } = this.state;
    var colors, grid, zoom;

    GOL.autoplay = this.getUrlParameter('autoplay') === '1' ? true : GOL.autoplay;
    GOL.trail.current = this.getUrlParameter('trail') === '1' ? true : GOL.trail.current;

    // Initial color config
    colors = parseInt(this.getUrlParameter('colors'), 10);
    if (isNaN(colors) || colors < 1 || colors > GOL.colors.schemes.length) {
      colors = 1;
    }

    // Initial grid config
    grid = parseInt(this.getUrlParameter('grid'), 10);
    if (isNaN(grid) || grid < 1 || grid > GOL.grid.schemes.length) {
      grid = 1;
    }

    // Initial zoom config
    zoom = parseInt(this.getUrlParameter('zoom'), 10);
    if (isNaN(zoom) || zoom < 1 || zoom > GOL.zoom.schemes.length) {
      zoom = 1;
    }

    GOL.colors.current = 3;
    GOL.grid.current = 3;
    GOL.zoom.current = 0;

    GOL.rows = GOL.zoom.schemes[GOL.zoom.current].rows;
    GOL.columns = GOL.zoom.schemes[GOL.zoom.current].columns;
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
            GOL.listLife.addCell(state[i][y][j], parseInt(y, 10), GOL.listLife.actualState);
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
      GOL.listLife.addCell(this.random(0, GOL.columns - 1), this.random(0, GOL.rows - 1), GOL.listLife.actualState);
    }

    this.listLife.nextGeneration();
  }

  /**
   * keepDOMElements
   * Save DOM references for this session (one time execution)
   */
  keepDOMElements() {
    let { GOL } = this.state;
    GOL.element.generation = document.getElementById('generation');
    GOL.element.steptime = document.getElementById('steptime');
    GOL.element.livecells = document.getElementById('livecells');
    GOL.element.messages.layout = document.getElementById('layoutMessages');
    GOL.element.hint = document.getElementById('hint');
  }

  /**
     * Prepare DOM elements and Canvas for a new run
     */
  prepare() {
    let { GOL } = this.state;
    GOL.generation = GOL.times.algorithm = GOL.times.gui = 0;
    GOL.mouseDown = GOL.clear.schedule = false;

    GOL.element.generation.innerHTML = '0';
    GOL.element.livecells.innerHTML = '0';
    GOL.element.steptime.innerHTML = '0 / 0 (0 / 0)';

    GOL.canvas.clearWorld(); // Reset GUI
    GOL.canvas.drawWorld(); // Draw State

    if (GOL.autoplay) { // Next Flow
      GOL.autoplay = false;
      // GOL.handlers.buttons.run();
    }
  }

  /**
   * Clean up actual state and prepare a new run
   */
  cleanUp = () => {
    let { GOL } = this.state;    
    GOL.listLife.init(); // Reset/init algorithm
    this.prepare();
  }

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

  render() {
    return (
      <div>
        <ConwayAnimate 
          GOL={this.state.GOL}
          runInit={this.runInit}
          cleanUp={this.cleanUp}
        />
      </div>
    );
  }
}

export default App;