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
    let { conwayConfig, rows, columns } = this.props;

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
    this.width = this.width + (cellSpace * columns) + (cellSize * columns);
    // this.width = window.innerWidth
    this._canvas.setAttribute('width', this.width);
    
    this.height = this.height + (cellSpace * rows) + (cellSize * rows);
    this._canvas.setAttribute('height', this.height);
    
    
    // Fill background
    context.fillStyle = conwayConfig.grid.schemes[conwayConfig.grid.current].color;
    context.fillRect(0, 0, this.width, this.height);
    
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
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
    let { colors } = conwayConfig;
    let context = this._canvas.getContext('2d');

    // boundary checking catch-all temp fix
    if (!Array.isArray(age) || !age.length || (i > age.length - 1) || !Array.isArray(age[i]) || !age[i].length) {
      return;
    } else {
      if (alive) {
        if (age[i][j] > -1) {
          context.fillStyle = colors.schemes[colors.current].alive[age[i][j] % colors.schemes[colors.current].alive.length];
        } 
      } else {
        if (conwayConfig.trail.current && age[i][j] < 0) {
          context.fillStyle = colors.schemes[colors.current].trail[(age[i][j] * -1) % colors.schemes[colors.current].trail.length];
        } else {
          context.fillStyle = colors.schemes[colors.current].dead;
        }
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
  // ─── MOUSE/TOUCH HANDLERS ─────────────────────────────────────────────────────────────
  //

  handleMouseDown = (e) => {
    this.props.canvasMouseDown(e);
  }

  handleMouseMove = (e) => {
    this.props.canvasMouseMove(e);
  }

  handleTouchStart = (e) => {
    this.handleMouseDown(e.touches[0]);
  }

  handleTouchMove = (e) => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //


  componentDidMount() {
    this.drawWorld();
    this._canvas.addEventListener("mousedown", this.handleMouseDown);
    this._canvas.addEventListener("mousemove", this.handleMouseMove);
    this._canvas.addEventListener("touchstart", this.handleTouchStart);
    this._canvas.addEventListener("touchmove", this.handleTouchMove);
  }

  componentDidUpdate(prevProps) {

    // drawCell triggers
    if(!isEqual(prevProps.cellUpdates, this.props.cellUpdates)) {
      this.props.cellUpdates.forEach(update => {
        let { i, j, alive } = update;
        this.drawCell(i, j, alive);
      })
    }
    
    // drawWorld triggers
    if(!isEqual(prevProps.conwayConfig, this.props.conwayConfig)) {
      this.drawWorld();
    }
  }

  componentWillUnmount() {
    this._canvas.removeEventListener("mousedown", this.handleMouseDown);
    this._canvas.removeEventListener("mousemove", this.handleMouseMove);
    this._canvas.removeEventListener("touchstart", this.handleTouchStart);
    this._canvas.removeEventListener("touchmove", this.handleTouchMove);
  }

  render() {
    return (
      <PureCanvas contextRef={this.saveContext} />
    );
  }
}

export default ConwayRender;