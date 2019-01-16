import React, { Component } from 'react';
import { lightOrDark } from '../helpers/lightOrDark';
import '../../styles/menu.scss';

class MenuButtons extends Component {

  handleSettingsClick = (e) => {
    this.props.toggleMenu();
    e.stopPropagation();
  }

  handleRunPauseClick = (e) => {
    e.stopPropagation();
    this.props.runHandler();
  }

  handleStepClick = (e) => {
    e.stopPropagation();
    this.props.stepHandler();
  }

  render() {
    let colorType = lightOrDark(this.props.currentColors.dead);
    let buttonColor;

    if(colorType === 'dark') {
      buttonColor = '#fff';
    } else {
      buttonColor = '#000';
    }

    let viewBox = '0 0 40 40'

    return (
      <React.Fragment>
        <svg
          onPointerDown={this.handleSettingsClick}
          className="menu-button settings-button"
          viewBox={viewBox}
        >
          <path fill={buttonColor} d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"  />
        </svg>
        {!this.props.running ? 
          (
            <React.Fragment>
              <svg
                onPointerDown={this.handleRunPauseClick}
                className="menu-button run-button"
                viewBox={viewBox}
              >
                <path fill={buttonColor} d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
              <svg
                onPointerDown={this.handleStepClick}
                className="menu-button step-button"
                viewBox={viewBox}
              >
                <path fill={buttonColor} d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />
              </svg>
              
            </React.Fragment>
          ) : 
          (
            <svg 
              onPointerDown={this.handleRunPauseClick}
              className="menu-button pause-button"
              viewBox={viewBox}
            >
              <path fill={buttonColor} d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          )
      
        }
      </React.Fragment>
    );
  }
}

export default MenuButtons;