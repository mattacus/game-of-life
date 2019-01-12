import React, { Component } from 'react';
import { lightOrDark } from '../helpers/lightOrDark';
import { MdSettings, MdPlayArrow, MdPause } from 'react-icons/md';
import { IconContext } from 'react-icons';
import '../../css/menu.css';

class MenuButtons extends Component {

  handleSettingsClick = (e) => {
    this.props.toggleMenu();
    e.stopPropagation();
  }

  handleRunPauseClick = (e) => {
    console.log(e.target)
    e.stopPropagation();
    this.props.runHandler();
  }

  render() {
    let colorType = lightOrDark(this.props.currentColors.dead);
    let buttonColor;

    if(colorType === 'dark') {
      buttonColor = '#fff';
    } else {
      buttonColor = '#000';
    }

    return (
      <React.Fragment>
        <IconContext.Provider value={{ color: buttonColor, className: "menu-button settings-button" }}>
          <MdSettings onClick={this.handleSettingsClick} />
        </IconContext.Provider>
        {!this.props.running ? 
          (<IconContext.Provider value={{ color: buttonColor, className: "menu-button run-button" }}>
            <MdPlayArrow onClick={this.handleRunPauseClick} />
          </IconContext.Provider>) : 
          (<IconContext.Provider value={{ color: buttonColor, className: "menu-button pause-button" }}>
            <MdPause onClick={this.handleRunPauseClick} />
          </IconContext.Provider>)
      
        }
      </React.Fragment>
    );
  }
}

export default MenuButtons;