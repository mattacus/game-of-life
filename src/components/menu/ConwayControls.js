import React, { Component } from 'react';

class ConwayControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speedValue: 50,
    }
  }

  handleCloseButton = (e) => {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  handleResetButton = (e) => {
    e.stopPropagation();
    this.props.clearHandler();
  }

  handleExportButton = (e) => {
    e.stopPropagation();
    this.props.exportHandler();
  }

  handleTrailButton = (e) => {
    e.stopPropagation();
    this.props.trailHandler();
  }

  handleGridButton = (e) => {
    e.stopPropagation();
    this.props.gridHandler();
  }
  handleColorsButton = (e) => {
    e.stopPropagation();
    this.props.colorsHandler();
  }

  handleSpeedSliderChange = (e) => {
    e.stopPropagation();
    let { value } = e.target;
    this.setState({ speedValue: value });
    this.props.updateWaitTime(value)
  }

  render() {
    let {status} = this.props;
    return (
      <div className="sliding-menu-container">
        <div className="box">
          <button className="button is-large is-fullwidth is-inverted is-primary" onPointerDown={this.handleCloseButton}>
            Hide Settings
          </button>
        </div>

        <div class="card default">
          <header class="card-header">
            <p class="card-header-title">
              Running Information
            </p>
          </header>
          <div class="card-content tag-card">
            <div class="tags has-addons" style={{ display: "inline", marginRight: "1px" }}>
                <span class="tag is-light">Generation</span>
                <span class="tag is-primary" id="generation">{status.generation}</span> 
              </div>
            <div class="tags has-addons" style={{ display: "inline", marginLeft: "1px" }}>
                <span class="tag is-light">Live cells</span>
                <span class="tag is-primary" id="livecells">{status.livecells}</span>
              </div>
          </div>
        </div>

        <div class="card default">
          <header class="card-header">
            <p class="card-header-title">
              Controls
            </p>
          </header>
          <div class="card-content">
            <div className="button-group">
              <button className="button button-group-item" onPointerDown={this.handleResetButton}>
                Reset
              </button>
              <button className="button button-group-item" onPointerDown={this.handleExportButton}>
                Export
              </button>
            </div>
            <div className="box">
              <p className="notification-text">Animation Speed</p>
              <input className="slider is-fullwidth is-primary" type="range" step="1" min="0" max="100" value={this.state.speedValue} onChange={this.handleSpeedSliderChange}/>
            </div>
            <div className="button-group">
              <button className="button button-group-item" onPointerDown={this.handleTrailButton}>
                Trail
            </button>
              <button className="button button-group-item" onPointerDown={this.handleGridButton}>
                Grid
            </button>
              <button className="button button-group-item" onPointerDown={this.handleColorsButton}>
                Colors
            </button>
            </div>
            <div className="notification is-default">
              <p className="notification-text">{status.messages.layout}</p>
            </div>
          </div>
        </div>

        <div class="card default">
          <header class="card-header">
            <p class="card-header-title">
              Patterns
            </p>
          </header>
          <div class="card-content">
            <div className="button"><a href="?autoplay=0&amp;trail=0&amp;grid=1&amp;colors=1&amp;zoom=1&amp;s=%5B{%228%22:%5B60,61,98,103,109,115%5D},{%229%22:%5B60,61,77,78,97,99,102,104,108,110,114,116%5D},{%2210%22:%5B76,79,98,103,105,109,111,115,117%5D},{%2211%22:%5B76,79,104,110,112,116,118%5D},{%2212%22:%5B60,61,63,64,77,78,111,117%5D},{%2213%22:%5B60,61,63,64%5D},{%2219%22:%5B76,77,79,97,98,102,103,108,109,114,115%5D},{%2220%22:%5B76,78,79,97,99,102,104,108,110,114,116%5D},{%2221%22:%5B98,103,105,109,111,115,117%5D},{%2222%22:%5B104,110,112,116,118%5D},{%2223%22:%5B61,111,117%5D},{%2224%22:%5B60,62,76,77%5D},{%2225%22:%5B60,62,75,78%5D},{%2226%22:%5B61,76,79%5D},{%2227%22:%5B77,78,96,97,102,103,109,110,115,116%5D},{%2228%22:%5B96,98,102,104,109,111,115,117%5D},{%2229%22:%5B61,65,97,98,103,105,110,112,116,118%5D},{%2230%22:%5B60,62,64,66,104,105,111,113,117,119%5D},{%2231%22:%5B60,62,64,66,75,76,112,113,118,120%5D},{%2232%22:%5B61,65,75,78,119,120%5D},{%2233%22:%5B77,78%5D},{%2237%22:%5B78,79%5D},{%2238%22:%5B77,79%5D},{%2239%22:%5B77%5D},{%2240%22:%5B60,61,63,64,75,77%5D},{%2241%22:%5B61,63,75,76%5D},{%2242%22:%5B61,63%5D},{%2243%22:%5B60,61,63,64,114%5D},{%2244%22:%5B78,79,84,85,92,93,95,113,115%5D},{%2245%22:%5B79,84,86,92,93,95,96,97,104,112,115%5D},{%2246%22:%5B78,86,98,103,105,111,113,114%5D},{%2247%22:%5B75,77,86,87,92,93,95,96,97,102,105,110,112%5D},{%2248%22:%5B75,76,93,95,103,104,109,112%5D},{%2249%22:%5B93,95,110,111%5D},{%2250%22:%5B94%5D}%5D" title="Still Life Patterns">Still Life</a></div>
            {/* <div className="button"><a href="" title="">Oscillators</a></div> */}
            <div className="button"><a href="?autoplay=0&amp;trail=0&amp;grid=1&amp;colors=1&amp;zoom=1&amp;s=%5B{%229%22:%5B44%5D},{%2210%22:%5B42,44%5D},{%2211%22:%5B32,33,40,41,54,55%5D},{%2212%22:%5B31,35,40,41,54,55%5D},{%2213%22:%5B20,21,30,36,40,41%5D},{%2214%22:%5B20,21,30,34,36,37,42,44%5D},{%2215%22:%5B30,36,44%5D},{%2216%22:%5B31,35%5D},{%2217%22:%5B32,33%5D}%5D" title="Gosper Glider Gun">Gosper Glider Gun</a></div>
            {/* <div className="button"><a href="" title="">Guns</a></div> */}
            <div className="button"><a href="?autoplay=0&amp;trail=0&amp;grid=1&amp;colors=1&amp;zoom=1&amp;s=%5B{%2239%22:%5B110%5D},{%2240%22:%5B112%5D},{%2241%22:%5B109,110,113,114,115%5D}%5D" title="Acorn Patter">Acorn</a></div>
            <div className="button"><a href="?autoplay=0&amp;trail=0&amp;grid=1&amp;colors=1&amp;zoom=1&amp;s=random" title="Random Pattern">Random</a></div>
          </div>
        </div>
        
        <div className="box" style={{display: "flex", justifyContent: "space-evenly"}}>
          <a class="button is-inverted is-dark" href="https://github.com/mattacus/game-of-life">
            <span class="icon is-small">
              <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg" />
            </span>
            <span> GitHub </span>
          </a>
          <a class="button is-inverted is-danger" href="http://pmav.eu/stuff/javascript-game-of-life-v3.1.1/">
            <span> Original </span>
          </a>
        </div>
      </div>
    );
  }
}

export default ConwayControls;