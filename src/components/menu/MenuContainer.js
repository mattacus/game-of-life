import React, { Component } from 'react';
import MenuButtons from './MenuButtons';
import Menu from './SlidingMenu';

class MenuContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  toggleMenu = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <div>
        <MenuButtons
          running={this.props.running}
          runHandler={this.props.runHandler}
          toggleMenu={this.toggleMenu}
          currentColors={this.props.currentColors}
        />
        <Menu 
          {...this.props}
          toggleMenu={this.toggleMenu}
          menuVisibility={this.state.visible}
        />
      </div>
    );
  }
}

export default MenuContainer;