import React, { Component } from 'react';
import ConwayRender from './ConwayRender';
import MenuContainer from './menu/MenuContainer';
import mousePosition from './helpers/mouseposition';

class ConwayAnimate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      lastX: 0,
      lastY: 0,
      age: undefined,
      rAF: undefined,
      running: false,
      waitTime: 50,
      cellUpdates: [], // list of updates to be passed to Render on each nextStep call
      status: {
        generation: null,
        steptime: null,
        livecells: null,
        messages: {
          layout: null
        }
      },
      times: {
        algorithm: 0,
        gui: 0
      },
      clear: false
    }
  }

  //
  // ─── ANIMATION STEPS ────────────────────────────────────────────────────────────
  //

  /**
     * Prepare DOM elements and Canvas for a new run
     */
  prepare() {
    let { status, times } = this.state;
    times.algorithm = times.gui = 0;

    status.generation = '0';
    status.livecells = '0';
    status.steptime = '0 / 0 (0 / 0)';

    this.setState({status, times, mouseDown: false});

     // Reset GUI
    this.clearWorld(() => {
      if (this.props.autoplay) {
        this.runHandler();
      }
    });

  }

  /**
   * Clean up and prepare a new run
   */
  cleanUp = () => {
    this.props.runInit(); // call top-level initialization routine
  }

  /**
   * Run Next Step
   */
  nextStep = () => {
    let { listLife } = this.props;
    let { age, status, times } = this.state;

    let i, x, y, r, liveCellNumber, algorithmTime, guiTime;

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

    // Running Information
    status.generation = (Number(status.generation) + 1).toString();
    status.livecells = liveCellNumber;

    r = 1.0 / Number(status.generation);
    times.algorithm = (times.algorithm * (1 - r)) + (algorithmTime * r);
    times.gui = (times.gui * (1 - r)) + (guiTime * r);
    status.steptime = algorithmTime + ' / ' + guiTime + ' (' + Math.round(times.algorithm) + ' / ' + Math.round(times.gui) + ')';

    // Batched state updates
    this.setState({
      status,
      age,
      cellUpdates
    });

    // Flow Control
    if (this.state.running) {
      function animateFrame() {
        this.rAF = window.requestAnimationFrame(this.nextStep);
      }

      if (this.state.waitTime > 0) setTimeout(() => { animateFrame.call(this) }, this.state.waitTime);
      else animateFrame.call(this);
    } else {
      if (this.state.clear) {
        this.cleanUp();
      }
    }
  }

  /**
   * clearWorld
   */
  clearWorld = (cb) => {
    let { rows, columns } = this.props;
    let i, j;

    // Init ages (Canvas reference)
    let age = [];
    for (i = 0; i < columns; i++) {
      age[i] = [];
      for (j = 0; j < rows; j++) {
        age[i][j] = 0; // Dead
      }
    }

    if(cb) {
      this.setState({ age }, cb);
    } else {
      this.setState({ age });
    }
  }

  /**
  * switchCell
  */
  switchCell(i, j) {
    let { listLife } = this.props;
    let { age } = this.state;
    let cellUpdates = [];

    if (listLife.isAlive(i, j)) {
      age = this.changeCelltoDead(i, j, age);
      cellUpdates.push({i, j, alive: false});
      listLife.removeCell(i, j, listLife.actualState);
    } else {
      age = this.changeCelltoAlive(i, j, age);
      cellUpdates.push({ i, j, alive: true });
      listLife.addCell(i, j, listLife.actualState);
    }

    this.setState({ age, cellUpdates });
  }

  /**
   * keepCellAlive
   */
  keepCellAlive(i, j, age) {
    let { rows, columns } = this.props;
    if (i >= 0 && i < columns && j >= 0 && j < rows) {
      age[i][j]++;
    }
    return age;
  }


  /**
   * changeCelltoAlive
   */
  changeCelltoAlive(i, j, age) {
    let { rows, columns } = this.props;
    if (i >= 0 && i < columns && j >= 0 && j < rows) {
      let { age } = this.state;
      age[i][j] = 1;
    }
    return age;
  }


  /**
   * changeCelltoDead
   */
  changeCelltoDead(i, j, age) {
    let { rows, columns } = this.props;
    if (i >= 0 && i < columns && j >= 0 && j < rows) {
      let { age } = this.state;
      age[i][j] = -age[i][j]; // Keep trail
    }
    return age;
  }

  //
  // ─── BUTTON HANDLERS ─────────────────────────────────────────────────────────────
  //

  handleKeys = (e) => {
    let event = e;
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
    let { running } = this.state;
    running = !running;
    this.setState({ running }, () => {
      if (running) {
        this.nextStep();
      }
    });
  }

  /**
  * Button Handler - Next Step - One Step only
  */
  stepHandler = () => {
    if (!this.state.running) {
      this.nextStep();
    }
  }

  /**
    * Button Handler - Clear World
  */
  clearHandler = () => {
    if (this.state.running) {
      this.setState({
        running: false,
        clear: true,
      });
    } else {
      this.cleanUp();
    }
  }

  /**
   * Button Handler - Remove/Add Trail
   */
  trailHandler = () => {
    let conwayConfig = JSON.parse(JSON.stringify(this.props.conwayConfig));
    let { status } = this.state;
    conwayConfig.trail.current = !conwayConfig.trail.current;
    status.messages.layout = conwayConfig.trail.current ? 'Trail is Off' : 'Trail is On';
    this.setState({ status });
    this.props.updateConfig(conwayConfig);
  }

  /**
   * Button Handler - Colors
   */
  colorsHandler = () => {
    let conwayConfig = JSON.parse(JSON.stringify(this.props.conwayConfig));
    let { status } = this.state;
    conwayConfig.colors.current = (conwayConfig.colors.current + 1) % conwayConfig.colors.schemes.length;
    status.messages.layout = 'Color Scheme #' + (conwayConfig.colors.current);
    this.setState({ status });
    this.props.updateConfig(conwayConfig);
  }


  /**
   *
   */
  gridHandler = () => {
    let conwayConfig = JSON.parse(JSON.stringify(this.props.conwayConfig));
    let { status } = this.state;
    conwayConfig.grid.current = (conwayConfig.grid.current + 1) % conwayConfig.grid.schemes.length;
    status.messages.layout = 'Grid Scheme #' + (conwayConfig.grid.current + 1);
    this.setState({ status });
    this.props.updateConfig(conwayConfig);
  }


  /**
   * Button Handler - Export State
   */
  exportHandler = () => {
    let { listLife } = this.props;
    let i, j, url = '', cellState = '', params = '';

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

  updateWaitTime = (newWaitTime) => {
    this.setState({ waitTime: newWaitTime });
  }

  //
  // ─── MOUSE/TOUCH HANDLERS ─────────────────────────────────────────────────────────────
  //

  canvasMouseDown = (event) => {
    let position = mousePosition(event, this.props.conwayConfig.zoom);
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
    if (this.state.mouseDown) {
      let position = mousePosition(event, this.props.conwayConfig.zoom);
      if ((position[0] !== this.state.lastX) || (position[1] !== this.state.lastY)) {
        this.switchCell(position[0], position[1]);
        this.setState({
          lastX: position[0],
          lastY: position[1]
        })
      }
    }
  }

  //
  // ─── LIFECYCLE ───────────────────────────────────────────────────────────────────────────
  //

    

  componentDidMount() {
    this.prepare();
    document.addEventListener("keydown", this.handleKeys, false);
    document.addEventListener("mouseup", this.canvasMouseUp, false);
    document.addEventListener("touchend", this.canvasMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
    document.removeEventListener("mouseup", this.canvasMouseUp, false);
    document.removeEventListener("touchend", this.canvasMouseUp, false);
    window.cancelAnimationFrame(this.rAF);
  }

  render() {
    let { conwayConfig } = this.props;
    let currentColors = conwayConfig.colors.schemes[conwayConfig.colors.current];

    return (
      <React.Fragment>
        <MenuContainer
          running={this.state.running}
          currentColors={currentColors}
          runHandler={this.runHandler}
          stepHandler={this.stepHandler}
          clearHandler={this.clearHandler}
          trailHandler={this.trailHandler}
          colorsHandler={this.colorsHandler}
          gridHandler={this.gridHandler}
          exportHandler={this.exportHandler}
          updateWaitTime={this.updateWaitTime}
          status={this.state.status}
         />
        {this.state.age ?
          <ConwayRender
            rows={this.props.rows}
            columns={this.props.columns}
            listLife={this.props.listLife}
            conwayConfig={this.props.conwayConfig}
            canvasMouseDown={this.canvasMouseDown}
            canvasMouseMove={this.canvasMouseMove}
            age={this.state.age}
            cellUpdates={this.state.cellUpdates}
          /> 
          : <h1>Loading...</h1>
        }
      </React.Fragment>
    );
  }
}

export default ConwayAnimate;