import React, { Component } from 'react'
import "./ToggleSwitchButton.css";

class ToggleSwitchButton extends Component {
  render() {
    return (
      <div className="container">
      {this.props.label}{" "}
      <div className="toggle-switch">
        <input type="checkbox" className="toggle-switch__checkbox" 
               name={this.props.label} id={this.props.label} onChange={this.props.changeTypeDataInput}/>
        <label className="toggle-switch__label" htmlFor={this.props.label}>
          <span className="toggle-switch__inner" />
          <span className="toggle-switch__button" />
        </label>
      </div>
    </div>
    )
  }
}
  
export default ToggleSwitchButton;