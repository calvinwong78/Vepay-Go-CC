import React from "react";

const Canvas = React.forwardRef((props, ref) => {
  return (
    <canvas
    className="size"
    ref={ref}
    width={props.width}
    height={props.height}
    style={props.style}
  />
  );
});

export default Canvas;
