import React, { Component } from 'react';
import ConwayRender from './ConwayRender';

class ConwayAnimate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      lastX: 0,
      lastY: 0,
    }
  }

  //
  // ─── ANIMATION STEPS ────────────────────────────────────────────────────────────
  //

  /**
   * Run Next Step
   */
  nextStep = () => {
    let { GOL, cleanUp } = this.props;

    var i, x, y, r, liveCellNumber, algorithmTime, guiTime;

    // Algorithm run

    algorithmTime = (new Date());

    liveCellNumber = GOL.listLife.nextGeneration();

    algorithmTime = (new Date()) - algorithmTime;


    // Canvas run

    guiTime = (new Date());

    for (i = 0; i < GOL.listLife.redrawList.length; i++) {
      x = GOL.listLife.redrawList[i][0];
      y = GOL.listLife.redrawList[i][1];

      if (GOL.listLife.redrawList[i][2] === 1) {
        GOL.canvas.changeCelltoAlive(x, y);
      } else if (GOL.listLife.redrawList[i][2] === 2) {
        GOL.canvas.keepCellAlive(x, y);
      } else {
        GOL.canvas.changeCelltoDead(x, y);
      }
    }

    guiTime = (new Date()) - guiTime;

    // Pos-run updates

    // Clear Trail
    if (GOL.trail.schedule) {
      GOL.trail.schedule = false;
      GOL.canvas.drawWorld();
    }

    // Change Grid
    if (GOL.grid.schedule) {
      GOL.grid.schedule = false;
      GOL.canvas.drawWorld();
    }

    // Change Colors
    if (GOL.colors.schedule) {
      GOL.colors.schedule = false;
      GOL.canvas.drawWorld();
    }

    // Running Information
    GOL.generation++;
    GOL.element.generation.innerHTML = GOL.generation;
    GOL.element.livecells.innerHTML = liveCellNumber;

    r = 1.0 / GOL.generation;
    GOL.times.algorithm = (GOL.times.algorithm * (1 - r)) + (algorithmTime * r);
    GOL.times.gui = (GOL.times.gui * (1 - r)) + (guiTime * r);
    GOL.element.steptime.innerHTML = algorithmTime + ' / ' + guiTime + ' (' + Math.round(GOL.times.algorithm) + ' / ' + Math.round(GOL.times.gui) + ')';

    // Flow Control
    if (GOL.running) {
      function animateFrame() {
        window.requestAnimationFrame(this.nextStep);
      }

      if (GOL.waitTime > 0) setTimeout(() => { animateFrame.call(this) }, GOL.waitTime);
      else animateFrame();
    } else {
      if (GOL.clear.schedule) {
        cleanUp();
      }
    }
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
      this.run();
    } else if (event.keyCode === 83) { // Key: S
      this.step();
    }
  }

  /**
  * Button Handler - Run
  */
  run = () => {
    let { GOL } = this.props;
    GOL.element.hint.style.display = 'none';

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
  step = () => {
    let { GOL } = this.props;
    if (!GOL.running) {
      this.nextStep();
    }
  }

  /**
    * Button Handler - Clear World
  */
  clear = () => {
    let { GOL } = this.props;
    if (GOL.running) {
      GOL.clear.schedule = true;
      GOL.running = false;
      document.getElementById('buttonRun').value = 'Run';
    } else {
      GOL.cleanUp();
    }
  }

  /**
   * Button Handler - Remove/Add Trail
   */
  trail = () => {
    let { GOL } = this.props;
    GOL.element.messages.layout.innerHTML = GOL.trail.current ? 'Trail is Off' : 'Trail is On';
    GOL.trail.current = !GOL.trail.current;
    if (GOL.running) {
      GOL.trail.schedule = true;
    } else {
      GOL.canvas.drawWorld();
    }
  }

  /**
   * Button Handler - Colors
   */
  colors = () => {
    let { GOL } = this.props;
    GOL.colors.current = (GOL.colors.current + 1) % GOL.colors.schemes.length;
    GOL.element.messages.layout.innerHTML = 'Color Scheme #' + (GOL.colors.current + 1);
    if (GOL.running) {
      GOL.colors.schedule = true; // Delay redraw
    } else {
      GOL.canvas.drawWorld(); // Force complete redraw
    }
  }


  /**
   *
   */
  grid = () => {
    let { GOL } = this.props;
    GOL.grid.current = (GOL.grid.current + 1) % GOL.grid.schemes.length;
    GOL.element.messages.layout.innerHTML = 'Grid Scheme #' + (GOL.grid.current + 1);
    if (GOL.running) {
      GOL.grid.schedule = true; // Delay redraw
    } else {
      GOL.canvas.drawWorld(); // Force complete redraw
    }
  }


  /**
   * Button Handler - Export State
   */
  export_ = () => {
    let { GOL } = this.props;
    var i, j, url = '', cellState = '', params = '';

    for (i = 0; i < GOL.listLife.actualState.length; i++) {
      cellState += '{"' + GOL.listLife.actualState[i][0] + '":[';
      //cellState += '{"one":[';
      for (j = 1; j < GOL.listLife.actualState[i].length; j++) {
        cellState += GOL.listLife.actualState[i][j] + ',';
      }
      cellState = cellState.substring(0, cellState.length - 1) + ']},';
    }

    cellState = cellState.substring(0, cellState.length - 1) + '';

    if (cellState.length !== 0) {
      url = (window.location.href.indexOf('?') === -1) ? window.location.href : window.location.href.slice(0, window.location.href.indexOf('?'));

      params = '?autoplay=0' +
        '&trail=' + (GOL.trail.current ? '1' : '0') +
        '&grid=' + (GOL.grid.current + 1) +
        '&colors=' + (GOL.colors.current + 1) +
        '&zoom=' + (GOL.zoom.current + 1) +
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
    let { GOL } = this.props;
    var position = this.mousePosition(event);
    GOL.canvas.switchCell(position[0], position[1]);
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
        GOL.canvas.switchCell(position[0], position[1]);
        this.setState({
          lastX: position[0],
          lastY: position[1]
        })
      }
    }
  }

  mousePosition(e) {
    let { GOL } = this.props;
    // http://www.malleus.de/FAQ/getImgMousePos.html
    // http://www.quirksmode.org/js/events_properties.html#position
    var event, x, y, domObject, posx = 0, posy = 0, top = 0, left = 0, cellSize = GOL.zoom.schemes[GOL.zoom.current].cellSize + 1;

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


  componentDidMount() {
    document.addEventListener("keydown", this.handleKeys, false);
    document.addEventListener("mouseup", this.canvasMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeys, false);
    document.removeEventListener("mouseup", this.canvasMouseUp, false);
  }

  

  render() {
    return (
      <React.Fragment>
        <ConwayRender
          run={this.run}
          step={this.step}
          clear={this.clear}
          trail={this.trail}
          colors={this.colors}
          grid={this.grid}
          export_={this.export_}
          canvasMouseDown={this.canvasMouseDown}
          canvasMouseMove={this.canvasMouseMove}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

export default ConwayAnimate;