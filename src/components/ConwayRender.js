import React, { Component } from 'react';
import ConwayControls from './ConwayControls';

class ConwayRender extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      context: null,
      width: null,
      height: null,
      age: null,
      cellSize: null,
      cellSpace: null,
    }
  }

  //
  // ─── CANVAS FUNCTIONS ───────────────────────────────────────────────────────────
  //

  // /**
  //      * init
  //      */
  // init() {
  //   let { GOL } = this.props;

  //   let canvas = this.canvasRef.current;
  //   let context = canvas.getContext('2d');
    
  //   let cellSize = GOL.zoom.schemes[GOL.zoom.current].cellSize;
  //   let cellSpace = 1;

  //   this.setState({
  //     context,
  //     cellSize,
  //     cellSpace
  //   });

  //   this.clearWorld();
  // }

  // /**
  //  * clearWorld
  //  */
  // clearWorld() {
  //   let { GOL } = this.props;

  //   var i, j;

  //   // Init ages (Canvas reference)
  //   let age = [];
  //   for (i = 0; i < GOL.columns; i++) {
  //     age[i] = [];
  //     for (j = 0; j < GOL.rows; j++) {
  //       age[i][j] = 0; // Dead
  //     }
  //   }

  //   this.setState({ age })
  // }

  // /**
  //  * drawWorld
  //  */
  // drawWorld() {
  //   let { GOL } = this.props;
  //   let { width, height, cellSize, cellSpace, context} = this.state;
  //   let canvas = this.canvasRef.current;

  //   var i, j;

  //   // Special no grid case
  //   if (GOL.grid.schemes[GOL.grid.current].color === '') {
  //     this.setNoGridOn();
  //     width = 0;
  //     height = 0;
  //   } else {
  //     this.setNoGridOff();
  //     width = 1;
  //     height = 1;
  //   }

  //   // Dynamic canvas size
  //   width = width + (cellSpace * GOL.columns) + (cellSize * GOL.columns);
  //   // this.width = window.innerWidth
  //   canvas.setAttribute('width', width);

  //   height = height + (cellSpace * GOL.rows) + (cellSize * GOL.rows);
  //   canvas.setAttribute('height', height);

  //   // Fill background
  //   context.fillStyle = GOL.grid.schemes[GOL.grid.current].color;
  //   context.fillRect(0, 0, width, height);

  //   for (i = 0; i < GOL.columns; i++) {
  //     for (j = 0; j < GOL.rows; j++) {
  //       if (GOL.listLife.isAlive(i, j)) {
  //         this.drawCell(i, j, true);
  //       } else {
  //         this.drawCell(i, j, false);
  //       }
  //     }
  //   }
  // }

  // /**
  //  * setNoGridOn
  //  */
  // setNoGridOn() {
  //   let { GOL } = this.props;
  //   let cellSize = GOL.zoom.schemes[GOL.zoom.current].cellSize + 1;
  //   let cellSpace = 0;
  //   this.setState({cellSize, cellSpace})
  // }

  // /**
  //      * setNoGridOff
  //      */
  // setNoGridOff() {
  //   let { GOL } = this.props;
  //   let cellSize = GOL.zoom.schemes[GOL.zoom.current].cellSize;
  //   let cellSpace = 1;
  //   this.setState({ cellSize, cellSpace })
  // }

  // /**
  //  * drawCell
  //  */
  // drawCell(i, j, alive) {
  //   let { GOL } = this.props;
  //   let { cellSize, cellSpace, context, age } = this.state;

  //   if (alive) {

  //     if (age[i][j] > -1)
  //       context.fillStyle = GOL.colors.schemes[GOL.colors.current].alive[age[i][j] % GOL.colors.schemes[GOL.colors.current].alive.length];

  //   } else {
  //     if (GOL.trail.current && age[i][j] < 0) {
  //       context.fillStyle = GOL.colors.schemes[GOL.colors.current].trail[(age[i][j] * -1) % GOL.colors.schemes[GOL.colors.current].trail.length];
  //     } else {
  //       context.fillStyle = GOL.colors.schemes[GOL.colors.current].dead;
  //     }
  //   }

  //   context.fillRect(cellSpace + (cellSpace * i) + (cellSize * i), cellSpace + (cellSpace * j) + (cellSize * j), cellSize, cellSize);

  // }

  // /**
  // * switchCell
  // */
  // switchCell(i, j) {
  //   let { GOL } = this.props;    
  //   if (GOL.listLife.isAlive(i, j)) {
  //     this.changeCelltoDead(i, j);
  //     GOL.listLife.removeCell(i, j, GOL.listLife.actualState);
  //   } else {
  //     this.changeCelltoAlive(i, j);
  //     GOL.listLife.addCell(i, j, GOL.listLife.actualState);
  //   }
  // }

  // /**
  //  * keepCellAlive
  //  */
  // keepCellAlive(i, j) {
  //   let { GOL } = this.props;    
  //   if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
  //     let { age } = this.state;
  //     age[i][j]++;
  //     this.setState({age}, () => {
  //       this.drawCell(i, j, true);
  //     });
  //   }
  // }


  // /**
  //  * changeCelltoAlive
  //  */
  // changeCelltoAlive(i, j) {
  //   let { GOL } = this.props;    
  //   if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
  //     let { age } = this.state;
  //     age[i][j] = 1;
  //     this.setState({ age }, () => {
  //       this.drawCell(i, j, true);
  //     });
  //   }
  // }


  // /**
  //  * changeCelltoDead
  //  */
  // changeCelltoDead(i, j) {
  //   let { GOL } = this.props;    
  //   if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
  //     let { age } = this.state;
  //     age[i][j] = -age[i][j]; // Keep trail
  //     this.setState({ age }, () => {
  //       this.drawCell(i, j, true);
  //     });
  //   }
  // }

  //
  // ─── MOUSE HANDLERS ─────────────────────────────────────────────────────────────
  //

  handleMouseDown = (e) => {
    this.props.canvasMouseDown(e);
  }

  handleMouseMove = (e) => {
    this.props.canvasMouseMove(e);
  }

  componentDidMount() {
    // this.init();
    this.props.runInit();
    let canvas = this.canvasRef.current;
    canvas.addEventListener("mousedown", this.handleMouseDown, false);
    canvas.addEventListener("mousemove", this.handleMouseMove, false);
  }

  componentWillUnmount() {
    let canvas = this.canvasRef.current;
    canvas.removeEventListener("mousedown", this.handleMouseDown, false);
    canvas.removeEventListener("mousemove", this.handleMouseMove, false);
  }

  render() {
    return (
      <div>
        <canvas id="canvas" ref={this.canvasRef} />
        <ConwayControls {...this.props} />
      </div>
    );
  }
}

export default ConwayRender;