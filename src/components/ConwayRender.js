import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import PureCanvas from './PureCanvas';


class ConwayRender extends Component {
  constructor(props) {
    super(props);
    // this.canvasRef = React.createRef();
    this.cellSize = undefined;
    this.cellSpace = undefined;
    this.width = undefined;
    this.height = undefined;
  }

  saveContext = (canvas) => {
    this._canvas = canvas;
  }

  //
  // ─── CANVAS FUNCTIONS ───────────────────────────────────────────────────────────
  //
  
  /**
   * drawWorld
   */
  drawWorld() {
    let { GOL, conwayConfig } = this.props;

    let context = this._canvas.getContext('2d');

    // Special no grid case
    if (conwayConfig.grid.schemes[conwayConfig.grid.current].color === '') {
      this.setNoGridOn();
      this.width = 0;
      this.height = 0;
    } else {
      this.setNoGridOff();
      this.width = 1;
      this.height = 1;
    }

    let { cellSize, cellSpace } = this;
    
    // Dynamic canvas size
    this.width = this.width + (cellSpace * GOL.columns) + (cellSize * GOL.columns);
    // this.width = window.innerWidth
    this._canvas.setAttribute('width', this.width);
    
    this.height = this.height + (cellSpace * GOL.rows) + (cellSize * GOL.rows);
    this._canvas.setAttribute('height', this.height);
    
    
    // Fill background
    context.fillStyle = conwayConfig.grid.schemes[conwayConfig.grid.current].color;
    context.fillRect(0, 0, this.width, this.height);
    
    for (let i = 0; i < GOL.columns; i++) {
      for (let j = 0; j < GOL.rows; j++) {
        if (this.props.listLife.isAlive(i, j)) {
          this.drawCell(i, j, true);
        } else {
          this.drawCell(i, j, false);
        }
      }
    }
  }

  /**
   * drawCell
   */
  drawCell(i, j, alive) {
    let { age, conwayConfig } = this.props;;
    let { cellSize, cellSpace } = this;

    let context = this._canvas.getContext('2d');

    if (alive) {
      if (age[i][j] > -1)
        context.fillStyle = conwayConfig.colors.schemes[conwayConfig.colors.current].alive[age[i][j] % conwayConfig.colors.schemes[conwayConfig.colors.current].alive.length];

    } else {
      if (conwayConfig.trail.current && age[i][j] < 0) {
        context.fillStyle = conwayConfig.colors.schemes[conwayConfig.colors.current].trail[(age[i][j] * -1) % conwayConfig.colors.schemes[conwayConfig.colors.current].trail.length];
      } else {
        context.fillStyle = conwayConfig.colors.schemes[conwayConfig.colors.current].dead;
      }
    }

    context.fillRect(cellSpace + (cellSpace * i) + (cellSize * i), cellSpace + (cellSpace * j) + (cellSize * j), cellSize, cellSize);

  }

  /**
   * setNoGridOn
   */
  setNoGridOn() {
    let { conwayConfig } = this.props;
    this.cellSize = conwayConfig.zoom.schemes[conwayConfig.zoom.current].cellSize + 1;
    this.cellSpace = 0;
  }

  /**
       * setNoGridOff
       */
  setNoGridOff() {
    let { conwayConfig } = this.props;
    this.cellSize = conwayConfig.zoom.schemes[conwayConfig.zoom.current].cellSize;
    this.cellSpace = 1;
  }


  //
  // ─── MOUSE HANDLERS ─────────────────────────────────────────────────────────────
  //

  handleMouseDown = (e) => {
    this.props.canvasMouseDown(e);
  }

  handleMouseMove = (e) => {
    this.props.canvasMouseMove(e);
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //


  componentDidMount() {
    this.drawWorld();
    this._canvas.addEventListener("mousedown", this.handleMouseDown, false);
    this._canvas.addEventListener("mousemove", this.handleMouseMove, false);
  }

  componentDidUpdate(prevProps) {

    // drawCell triggers
    if(!isEqual(prevProps.cellUpdates, this.props.cellUpdates)) {
      this.props.cellUpdates.forEach(update => {
        let { i, j, alive } = update;
        this.drawCell(i, j, alive);
      })
    }

    if(!isEqual(prevProps.conwayConfig, this.props.conwayConfig)) {
      this.drawWorld();
    }
  }

  componentWillUnmount() {
    this._canvas.removeEventListener("mousedown", this.handleMouseDown, false);
    this._canvas.removeEventListener("mousemove", this.handleMouseMove, false);
  }

  render() {
    return (
      <PureCanvas contextRef={this.saveContext} />
    );
  }
}

export default ConwayRender;