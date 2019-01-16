import React, { Component } from 'react';
import ConwayControls from './ConwayControls';
import '../../styles/menu.scss';

class SlidingMenu extends Component {

  render() {
    let visibility = "hide";
    if (this.props.menuVisibility) {
      visibility = "show";
    }

    return (
      <div 
        className={`sliding-menu ${visibility}`}
      >
        <ConwayControls 
          {...this.props}
          toggleMenu={this.props.toggleMenu}
        />
      </div>
    );
  }
}

export default SlidingMenu;