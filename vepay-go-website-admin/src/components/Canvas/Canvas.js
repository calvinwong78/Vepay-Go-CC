import React from "react";

class Canvas extends React.Component {
  render() {
    return (
      <canvas
        className={this.props.className}
        ref={this.props.canvasRef}
        style={this.props.style}
      />
    );
  }
}
export default Canvas;



