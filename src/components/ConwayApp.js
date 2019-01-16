import React, { Component } from 'react';
import ConwayAnimate from './ConwayAnimate';
import { conwayConfig } from './helpers/config';
import { listLife } from './helpers/listLife';
import '../styles/app.scss';

class ConwayApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conwayConfig,
      listLife,
      urlParameters: null,
      loading: true,
      rows: 0,
      columns: 0
    }
    this.autoplay = false;
  }

  //
  // ─── INIT FUNCTIONS ─────────────────────────────────────────────────────────────
  //


  runInit = () => {
    try {
      this.setState({ loading: true }, () => {
        listLife.init();   // Reset/init algorithm
        let { conwayConfig, rows, columns, initialState } = this.loadConfig();  // Load config from URL (autoplay, colors, zoom, ...)
        this.loadState(initialState);       // Load state from URL
        this.setState({
          conwayConfig,
          rows,
          columns,
          initialState,
          loading: false
        });
      })
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  /**
   * Load config from URL
   */
  loadConfig() {
    let { conwayConfig, rows, columns } = this.state;
    let { colors, grid, zoom, trail } = conwayConfig;

    this.autoplay = this.getUrlParameter('autoplay') === '1' ? true : this.autoplay;
    if (this.getUrlParameter('trail') === '1') {
      trail.current = true;
      conwayConfig.trail = trail;
    }
    
    // Initial color config
    let urlColors = parseInt(this.getUrlParameter('colors'), 10);
    if (isNaN(urlColors) || urlColors < 1 || urlColors > conwayConfig.colors.schemes.length) {
      colors.current = 3;
    }
      
    // Initial grid config
    let urlGrid = parseInt(this.getUrlParameter('grid'), 10);
    if (isNaN(urlGrid) || urlGrid < 1 || urlGrid > conwayConfig.grid.schemes.length) {
      grid.current = 3;
    }
      
    // Initial zoom config
    let urlZoom = parseInt(this.getUrlParameter('zoom'), 10);
    if (isNaN(urlZoom) || urlZoom < 1 || urlZoom > conwayConfig.zoom.schemes.length) {
      zoom.current = 0;
    }

    conwayConfig.colors = colors;
    conwayConfig.grid = grid;
    conwayConfig.zoom = zoom;
    
    rows = conwayConfig.zoom.schemes[conwayConfig.zoom.current].rows;
    columns = conwayConfig.zoom.schemes[conwayConfig.zoom.current].columns;
    
    const zoomFactor = conwayConfig.zoom.schemes[conwayConfig.zoom.current].cellSize + 1;
    const midX = Math.round((window.innerWidth / 2) / zoomFactor);
    const midY = Math.round((window.innerHeight / 2) / zoomFactor);

    let initialState = `[{"${(midY)}":[${(midX) + 1}]},{"${(midY) + 1}":[${(midX) + 3}]},{"${(midY) + 2}":[${(midX)},${(midX) + 1},${(midX) + 4},${(midX) + 5},${(midX) + 6}]}]`;


    return { conwayConfig, rows, columns, initialState };
  }

  /**
     * Load world state from URL parameter
     */
  loadState(initialState) {
    let state, i, j, y, s = this.getUrlParameter('s');

    if (s === 'random') {
      this.randomState();
    } else {
      if (s == undefined) {
        s = initialState;
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
    let { rows, columns } = this.state;
    let i, liveCells = (rows * columns) * 0.12;

    for (i = 0; i < liveCells; i++) {
      listLife.addCell(this.random(0, columns - 1), this.random(0, rows - 1), listLife.actualState);
    }

    this.listLife.nextGeneration();
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
      let hash, hashes, i;
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
           autoplay={this.autoplay}
           listLife={this.state.listLife}
           conwayConfig={this.state.conwayConfig}
           updateConfig={this.updateConfig}
           runInit={this.runInit}
           rows={this.state.rows}
           columns={this.state.columns}
         />
         : <div>Loading...</div>
       }
     </React.Fragment>
    );
  }
}

export default ConwayApp;