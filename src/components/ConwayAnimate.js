import React, { Component } from 'react';
import ConwayRender from './ConwayRender';
import ConwayControls from './ConwayControls';

class ConwayAnimate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      lastX: 0,
      lastY: 0,
      age: undefined,
      rAF: undefined,
      cellUpdates: [], // list of updates to be passed to Render on each nextStep call
      status: {
        generation: null,
        steptime: null,
        livecells: null,
        messages: {
          layout: null
        }
      },
    }
  }

  //
  // ─── ANIMATION STEPS ────────────────────────────────────────────────────────────
  //

  /**
     * Prepare DOM elements and Canvas for a new run
     */
  prepare() {
    let { GOL } = this.props;
    let { status } = this.state;
    GOL.generation = GOL.times.algorithm = GOL.times.gui = 0;
    this.setState({ mouseDown: false});
    GOL.clear.schedule = false;

    status.generation = '0';
    status.livecells = '0';
    status.steptime = '0 / 0 (0 / 0)';
    this.setState({status});

    this.clearWorld(); // Reset GUI

    if (GOL.autoplay) { // Next Flow
      GOL.autoplay = false;
      // this.runHandler();
    }
  }

  /**
   * Clean up actual state and prepare a new run
   */
  cleanUp = () => {
    let { listLife } = this.props;
    listLife.init(); // Reset/init algorithm
    this.prepare();
  }

  /**
   * Run Next Step
   */
  nextStep = () => {
    let { GOL, conwayConfig, listLife } = this.props;
    let { status, age } = this.state;

    var i, x, y, r, liveCellNumber, algorithmTime, guiTime;

    // Algorithm run

    algorithmTime = (new Date());

    liveCellNumber = listLife.nextGeneration();

    algorithmTime = (new Date()) - algorithmTime;


    // Collect updates to be passed to canvas

    let cellUpdates = [];

    guiTime = (new Date());

    for (i = 0; i < listLife.redrawList.length; i++) {
      x = listLife.redrawList[i][0];
      y = listLife.redrawList[i][1];

      if (listLife.redrawList[i][2] === 1) {
        age = this.changeCelltoAlive(x, y, age);
        cellUpdates.push({ i: x, j: y, alive: true });
      } else if (listLife.redrawList[i][2] === 2) {
        age = this.keepCellAlive(x, y, age);
        cellUpdates.push({ i: x, j: y, alive: true });
      } else {
        age = this.changeCelltoDead(x, y, age);
        cellUpdates.push({ i: x, j: y, alive: false });
      }
    }

    guiTime = (new Date()) - guiTime;


    // Clear Trail
    if (conwayConfig.trail.schedule) {
      conwayConfig.trail.schedule = false;
      this.props.updateConfig(conwayConfig);
    }

    // Change Grid
    if (conwayConfig.grid.schedule) {
      conwayConfig.grid.schedule = false;
      this.props.updateConfig(conwayConfig);      
    }

    // Change Colors
    if (conwayConfig.colors.schedule) {
      conwayConfig.colors.schedule = false;
      this.props.updateConfig(conwayConfig);      
    }

    // Running Information
    GOL.generation++;
    status.generation = GOL.generation;
    status.livecells = liveCellNumber;

    r = 1.0 / GOL.generation;
    GOL.times.algorithm = (GOL.times.algorithm * (1 - r)) + (algorithmTime * r);
    GOL.times.gui = (GOL.times.gui * (1 - r)) + (guiTime * r);
    status.steptime = algorithmTime + ' / ' + guiTime + ' (' + Math.round(GOL.times.algorithm) + ' / ' + Math.round(GOL.times.gui) + ')';

    // Batched state updates
    this.setState({
      status,
      age,
      cellUpdates
    });

    // Flow Control
    if (GOL.running) {
      function animateFrame() {
        this.rAF = window.requestAnimationFrame(this.nextStep);
      }

      if (GOL.waitTime > 0) setTimeout(() => { animateFrame.call(this) }, GOL.waitTime);
      else animateFrame.call(this);
    } else {
      if (GOL.clear.schedule) {
        this.cleanUp();
      }
    }
  }

  /**
   * clearWorld
   */
  clearWorld = () => {
    let { GOL } = this.props;
    var i, j;

    // Init ages (Canvas reference)
    let age = [];
    for (i = 0; i < GOL.columns; i++) {
      age[i] = [];
      for (j = 0; j < GOL.rows; j++) {
        age[i][j] = 0; // Dead
      }
    }

    this.setState({ age })
  }

  /**
  * switchCell
  */
  switchCell(i, j) {
    let { listLife } = this.props;
    if (listLife.isAlive(i, j)) {
      this.changeCelltoDead(i, j);
      listLife.removeCell(i, j, listLife.actualState);
    } else {
      this.changeCelltoAlive(i, j);
      listLife.addCell(i, j, listLife.actualState);
    }
  }

  /**
   * keepCellAlive
   */
  keepCellAlive(i, j, age) {
    let { GOL } = this.props;
    if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
      age[i][j]++;
    }
    return age;
  }


  /**
   * changeCelltoAlive
   */
  changeCelltoAlive(i, j, age) {
    let { GOL } = this.props;
    if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
      let { age } = this.state;
      age[i][j] = 1;
    }
    return age;
  }


  /**
   * changeCelltoDead
   */
  changeCelltoDead(i, j, age) {
    let { GOL } = this.props;
    if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
      let { age } = this.state;
      age[i][j] = -age[i][j]; // Keep trail
    }
    return age;
  }

  //
  // ─── BUTTON HANDLERS ─────────────────────────────────────────────────────────────
  //

  handleKeys = (e) => {
    var event = e;
    if (!event) {
      event = window.event;
    }

    if (event.keyCode === 67) { // Key: C
      this.clear();
    } else if (event.keyCode === 82) { // Key: R
      this.runHandler();
    } else if (event.keyCode === 83) { // Key: S
      this.stepHandler();
    }
  }

  /**
  * Button Handler - Run
  */
  runHandler = () => {
    let { GOL } = this.props;

    GOL.running = !GOL.running;
    if (GOL.running) {
      this.nextStep();
      document.getElementById('buttonRun').value = 'Stop';
    } else {
      document.getElementById('buttonRun').value = 'Run';
    }
  }

  /**
  * Button Handler - Next Step - One Step only
  */
  stepHandler = () => {
    let { GOL } = this.props;
    if (!GOL.running) {
      this.nextStep();
    }
  }

  /**
    * Button Handler - Clear World
  */
  clearHandler = () => {
    let { GOL } = this.props;
    if (GOL.running) {
      GOL.clear.schedule = true;
      GOL.running = false;
      document.getElementById('buttonRun').value = 'Run';
    } else {
      this.cleanUp();
    }
  }

  /**
   * Button Handler - Remove/Add Trail
   */
  trailHandler = () => {
    let { GOL, conwayConfig } = this.props;
    conwayConfig.trail.current = !conwayConfig.trail.current;
    status.messages.layout = conwayConfig.trail.current ? 'Trail is Off' : 'Trail is On';
    this.setState({ status });
    if (GOL.running) {
      // TODO: fix schedule updating while running 
      conwayConfig.trail.schedule = true;
    } else {
      this.props.updateConfig(conwayConfig);
    }
  }

  /**
   * Button Handler - Colors
   */
  colorsHandler = () => {
    let { GOL, conwayConfig } = this.props;
    conwayConfig.colors.current = (conwayConfig.colors.current + 1) % conwayConfig.colors.schemes.length;
    status.messages.layout = 'Color Scheme #' + (GOL.colors.current + 1);
    this.setState({ status });
    if (GOL.running) {
      // TODO: fix schedule updating while running
      conwayConfig.colors.schedule = true; // Delay redraw
    } else {
      this.props.updateConfig(conwayConfig); // Force complete redraw
    }
  }


  /**
   *
   */
  gridHandler = () => {
    let { GOL, conwayConfig } = this.props;
    conwayConfig.grid.current = (conwayConfig.grid.current + 1) % conwayConfig.grid.schemes.length;
    status.messages.layout = 'Grid Scheme #' + (conwayConfig.grid.current + 1);
    this.setState({ status });
    if (GOL.running) {
      // TODO: fix schedule updating while running
      conwayConfig.grid.schedule = true; // Delay redraw
    } else {
      this.props.updateConfig(conwayConfig); // Force complete redraw
    }
  }


  /**
   * Button Handler - Export State
   */
  exportHandler = () => {
    let { listLife } = this.props;
    var i, j, url = '', cellState = '', params = '';

    for (i = 0; i < listLife.actualState.length; i++) {
      cellState += '{"' + listLife.actualState[i][0] + '":[';
      //cellState += '{"one":[';
      for (j = 1; j < listLife.actualState[i].length; j++) {
        cellState += listLife.actualState[i][j] + ',';
      }
      cellState = cellState.substring(0, cellState.length - 1) + ']},';
    }

    cellState = cellState.substring(0, cellState.length - 1) + '';

    if (cellState.length !== 0) {
      url = (window.location.href.indexOf('?') === -1) ? window.location.href : window.location.href.slice(0, window.location.href.indexOf('?'));

      let { trail, grid, colors, zoom } = this.props.conwayConfig;
      params = '?autoplay=0' +
        '&trail=' + (trail.current ? '1' : '0') +
        '&grid=' + (grid.current + 1) +
        '&colors=' + (colors.current + 1) +
        '&zoom=' + (zoom.current + 1) +
        '&s=[' + cellState + ']';

      document.getElementById('exportUrlLink').href = params;
      document.getElementById('exportTinyUrlLink').href = 'http://tinyurl.com/api-create.php?url=' + url + params;
      document.getElementById('exportUrl').style.display = 'inline';
    }
  }

  //
  // ─── MOUSE HANDLERS ─────────────────────────────────────────────────────────────
  //

  canvasMouseDown = (event) => {
    var position = this.mousePosition(event);
    this.switchCell(position[0], position[1]);
    this.setState({
      lastX : position[0],
      lastY: position[1],
      mouseDown: true
    });
  }

  canvasMouseUp = () => {
    this.setState({
      mouseDown: false
    });
  }

  canvasMouseMove = (event) => {
    let { GOL } = this.props;
    if (this.state.mouseDown) {
      var position = this.mousePosition(event);
      if ((position[0] !== this.state.lastX) || (position[1] !== this.state.lastY)) {
        this.switchCell(position[0], position[1]);
        this.setState({
          lastX: position[0],
          lastY: position[1]
        })
      }
    }
  }

  mousePosition(e) {
    let {zoom} = this.props.conwayConfig;
    // http://www.malleus.de/FAQ/getImgMousePos.html
    // http://www.quirksmode.org/js/events_properties.html#position
    var event, x, y, domObject, posx = 0, posy = 0, top = 0, left = 0, cellSize = zoom.schemes[zoom.current].cellSize + 1;

    event = e;
    if (!event) {
      event = window.event;
    }

    if (event.pageX || event.pageY) {
      posx = event.pageX;
      posy = event.pageY;
    } else if (event.clientX || event.clientY) {
      posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    domObject = event.target || event.srcElement;

    while (domObject.offsetParent) {
      left += domObject.offsetLeft;
      top += domObject.offsetTop;
      domObject = domObject.offsetParent;
    }

    domObject.pageTop = top;
    domObject.pageLeft = left;

    x = Math.ceil(((posx - domObject.pageLeft) / cellSize) - 1);
    y = Math.ceil(((posy - domObject.pageTop) / cellSize) - 1);

    return [x, y];
  }

  //
  // ─── LIFECYCLE ───────────────────────────────────────────────────────────────────────────
  //

    

  componentDidMount() {
    this.prepare();
    document.addEventListener("keydown", this.handleKeys, false);
    document.addEventListener("mouseup", this.canvasMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
    document.removeEventListener("mouseup", this.canvasMouseUp, false);
    window.cancelAnimationFrame(this.rAF);
  }

  

  render() {
    return (
      <React.Fragment>
        {this.state.age ?
          <ConwayRender
            GOL={this.props.GOL}
            listLife={this.props.listLife}
            runInit={this.props.runInit}
            conwayConfig={this.props.conwayConfig}
            canvasMouseDown={this.canvasMouseDown}
            canvasMouseMove={this.canvasMouseMove}
            clearWorld={this.clearWorld}
            age={this.state.age}
            cellUpdates={this.state.cellUpdates}
          /> 
          : <h1>Loading...</h1>
        }
        <ConwayControls 
          {...this.props}
          runHandler={this.runHandler}
          stepHandler={this.stepHandler}
          clearHandler={this.clearHandler}
          trailHandler={this.trailHandler}
          colorsHandler={this.colorsHandler}
          gridHandler={this.gridHandler}
          exportHandler={this.exportHandler}
          status={this.state.status}
        />
      </React.Fragment>
    );
  }
}

export default ConwayAnimate;