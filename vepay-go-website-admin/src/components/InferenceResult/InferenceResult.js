/* eslint-disable no-useless-constructor */
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

class InferenceResult extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div style={{ height: "25%" }}>
          <h3>License Plate Picture: </h3>
          <div>{this.props.licensePlatePicture}</div>
        </div>
        {this.props.loadingInferenceResult ? (
          <div>
            <div style={{ height: "25%" }}>
              <h3>Inference Result: </h3>
              <Skeleton count={1} />
            </div>
            <div style={{ height: "25%" }}>
              <h3>Date Entered: </h3>
              <Skeleton count={1} />
            </div>
            <div style={{ height: "25%" }}>
              <h3>Time Entered: </h3>
              <Skeleton count={1} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ height: "25%" }}>
              <h3>Inference Result: </h3>
              <div>{this.props.inferenceResult}</div>
            </div>
            <div style={{ height: "25%" }}>
              <h3>Date Entered: </h3>
              <div>{this.props.date}</div>
            </div>
            <div style={{ height: "25%" }}>
              <h3>Time Entered: </h3>
              <div>{this.props.time}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default InferenceResult;
