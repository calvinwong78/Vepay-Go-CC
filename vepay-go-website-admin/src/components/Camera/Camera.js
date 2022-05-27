import React from "react";

const Camera = React.forwardRef((props, ref) => {
  return (
    <video
      className="size"
      autoPlay
      playsInline
      muted
      ref={ref}
      id="frame"
      width={props.width}
      height={props.height}
    />
  );
});

export default Camera;
